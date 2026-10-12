/**
 * Plaid client wrapper: Link tokens, token exchange, balances,
 * cursor-based transaction sync and webhook verification.
 */

import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
  type RemovedTransaction,
  type Transaction as PlaidTransaction,
} from 'plaid';
import { createHash } from 'crypto';
import { decodeProtectedHeader, importJWK, jwtVerify } from 'jose';

let client: PlaidApi | null = null;

export function isPlaidConfigured(): boolean {
  return Boolean(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET);
}

function getClient(): PlaidApi {
  if (!isPlaidConfigured()) throw new Error('Bank linking is not configured');
  if (!client) {
    const env = process.env.PLAID_ENV || 'sandbox';
    client = new PlaidApi(
      new Configuration({
        basePath: PlaidEnvironments[env],
        baseOptions: {
          headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
            'PLAID-SECRET': process.env.PLAID_SECRET!,
          },
        },
      })
    );
  }
  return client;
}

export async function createLinkToken(userId: string): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const res = await getClient().linkTokenCreate({
    user: { client_user_id: userId },
    client_name: 'Aurum',
    products: [Products.Transactions],
    country_codes: [CountryCode.Us],
    language: 'en',
    // Plaid only accepts https webhooks
    webhook: appUrl?.startsWith('https://') ? `${appUrl}/api/webhooks/plaid` : undefined,
  });
  return res.data.link_token;
}

export async function exchangePublicToken(publicToken: string) {
  const res = await getClient().itemPublicTokenExchange({ public_token: publicToken });
  return { accessToken: res.data.access_token, itemId: res.data.item_id };
}

export async function getAccounts(accessToken: string) {
  const res = await getClient().accountsGet({ access_token: accessToken });
  return res.data.accounts.map((a) => ({
    accountId: a.account_id,
    name: a.name,
    mask: a.mask ?? null,
    subtype: a.subtype ?? null,
    balance: a.balances.current ?? 0,
  }));
}

export interface SyncResult {
  added: PlaidTransaction[];
  modified: PlaidTransaction[];
  removed: RemovedTransaction[];
  cursor: string | undefined;
}

/** Pulls every page of changes since `cursor`. */
export async function syncItemTransactions(accessToken: string, cursor?: string | null): Promise<SyncResult> {
  const result: SyncResult = { added: [], modified: [], removed: [], cursor: cursor ?? undefined };
  let hasMore = true;
  while (hasMore) {
    const res = await getClient().transactionsSync({
      access_token: accessToken,
      cursor: result.cursor,
      count: 250,
    });
    result.added.push(...res.data.added);
    result.modified.push(...res.data.modified);
    result.removed.push(...res.data.removed);
    result.cursor = res.data.next_cursor;
    hasMore = res.data.has_more;
  }
  return result;
}

export async function removeItem(accessToken: string): Promise<void> {
  await getClient().itemRemove({ access_token: accessToken });
}

/**
 * Verifies the `Plaid-Verification` JWT on a webhook request
 * (https://plaid.com/docs/api/webhooks/webhook-verification/).
 */
export async function verifyWebhook(rawBody: string, token: string | null): Promise<boolean> {
  if (!token) return false;
  try {
    const header = decodeProtectedHeader(token);
    if (header.alg !== 'ES256' || !header.kid) return false;

    const keyRes = await getClient().webhookVerificationKeyGet({ key_id: header.kid });
    const key = await importJWK(keyRes.data.key as any, 'ES256');
    const { payload } = await jwtVerify(token, key, { algorithms: ['ES256'], maxTokenAge: '5 min' });

    const bodyHash = createHash('sha256').update(rawBody).digest('hex');
    return payload.request_body_sha256 === bodyHash;
  } catch {
    return false;
  }
}
