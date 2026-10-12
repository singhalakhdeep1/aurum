/**
 * POST /api/bank/exchange - Finish Plaid Link: store the (encrypted) access
 * token, create a local account per bank account, and run the first import.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError } from '@/shared/lib/middleware/error-handler';
import { exchangePublicToken, getAccounts } from '@/shared/lib/bank/plaid';
import { syncBankItem } from '@/shared/lib/bank/sync';
import { encryptToken } from '@/shared/lib/security/token-crypto';
import { exchangePlaidPublicTokenSchema } from '@/shared/lib/validators/schemas';

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const { publicToken, institutionName } = exchangePlaidPublicTokenSchema.parse(await req.json());

    const { accessToken, itemId } = await exchangePublicToken(publicToken);
    const accounts = await getAccounts(accessToken);
    const encrypted = encryptToken(accessToken);
    const bank = institutionName || 'Bank';

    const hasAccounts = (await prisma.account.count({ where: { userId } })) > 0;

    for (const [index, acct] of accounts.entries()) {
      const existing = await prisma.linkedBankAccount.findUnique({
        where: { userId_plaidAccountId: { userId, plaidAccountId: acct.accountId } },
      });
      if (existing) {
        await prisma.linkedBankAccount.update({
          where: { id: existing.id },
          data: { accessToken: encrypted, plaidItemId: itemId, balance: acct.balance },
        });
        continue;
      }

      const local = await prisma.account.create({
        data: {
          name: `${bank} - ${acct.name}`,
          type: acct.subtype === 'savings' ? 'SAVINGS' : 'CURRENT',
          balance: acct.balance,
          isDefault: !hasAccounts && index === 0,
          userId,
        },
      });
      await prisma.linkedBankAccount.create({
        data: {
          plaidItemId: itemId,
          plaidAccountId: acct.accountId,
          accessToken: encrypted,
          institutionName: bank,
          name: acct.name,
          mask: acct.mask,
          subtype: acct.subtype,
          balance: acct.balance,
          userId,
          accountId: local.id,
        },
      });
    }

    const summary = await syncBankItem(itemId);
    return NextResponse.json({ linked: accounts.length, imported: summary.added }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
