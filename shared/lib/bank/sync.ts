/**
 * Imports a Plaid item's new transactions into the local ledger.
 * Local account balances are set from the bank's balance (authoritative),
 * so imported history never double-counts.
 */

import { prisma } from '@/shared/lib/db/prisma';
import { decryptToken } from '@/shared/lib/security/token-crypto';
import { getAccounts, syncItemTransactions } from './plaid';

const CATEGORY_MAP: Record<string, string> = {
  FOOD_AND_DRINK: 'food',
  GENERAL_MERCHANDISE: 'shopping',
  TRANSPORTATION: 'transportation',
  TRAVEL: 'travel',
  RENT_AND_UTILITIES: 'utilities',
  HOME_IMPROVEMENT: 'housing',
  MEDICAL: 'healthcare',
  PERSONAL_CARE: 'personal',
  ENTERTAINMENT: 'entertainment',
  GENERAL_SERVICES: 'bills',
  LOAN_PAYMENTS: 'bills',
};

function mapCategory(primary: string | undefined, isIncome: boolean): string {
  if (isIncome) return primary === 'INCOME' ? 'salary' : 'other-income';
  return (primary && CATEGORY_MAP[primary]) || 'other-expense';
}

export interface SyncSummary {
  added: number;
  modified: number;
  removed: number;
}

export async function syncBankItem(plaidItemId: string): Promise<SyncSummary> {
  const links = await prisma.linkedBankAccount.findMany({ where: { plaidItemId } });
  if (links.length === 0) return { added: 0, modified: 0, removed: 0 };

  const userId = links[0].userId;
  const accessToken = decryptToken(links[0].accessToken);
  const accountByPlaidId = new Map(links.map((l) => [l.plaidAccountId, l.accountId]));

  const changes = await syncItemTransactions(accessToken, links[0].syncCursor);

  const upserts = [...changes.added, ...changes.modified].flatMap((t) => {
    const accountId = accountByPlaidId.get(t.account_id);
    if (!accountId) return [];
    // Plaid reports money leaving the account as a positive amount
    const isIncome = t.amount < 0;
    const data = {
      type: isIncome ? ('INCOME' as const) : ('EXPENSE' as const),
      amount: Math.abs(t.amount),
      description: t.merchant_name || t.name,
      date: new Date(t.date),
      category: mapCategory(t.personal_finance_category?.primary, isIncome),
      status: t.pending ? ('PENDING' as const) : ('COMPLETED' as const),
      accountId,
      userId,
    };
    return [prisma.transaction.upsert({ where: { externalId: t.transaction_id }, update: data, create: { ...data, externalId: t.transaction_id } })];
  });

  const removedIds = changes.removed.map((r) => r.transaction_id).filter((id): id is string => Boolean(id));

  await prisma.$transaction([
    ...upserts,
    prisma.transaction.deleteMany({ where: { externalId: { in: removedIds }, userId } }),
  ]);

  // Refresh balances
  const fresh = await getAccounts(accessToken);
  const now = new Date();
  await prisma.$transaction(
    links.flatMap((link) => {
      const balance = fresh.find((a) => a.accountId === link.plaidAccountId)?.balance ?? Number(link.balance);
      return [
        prisma.linkedBankAccount.update({
          where: { id: link.id },
          data: { balance, syncCursor: changes.cursor, lastSyncedAt: now },
        }),
        ...(link.accountId ? [prisma.account.update({ where: { id: link.accountId }, data: { balance } })] : []),
      ];
    })
  );

  return { added: changes.added.length, modified: changes.modified.length, removed: removedIds.length };
}
