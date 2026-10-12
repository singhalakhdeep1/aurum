/**
 * POST /api/transactions/bulk-delete - Delete several transactions and
 * revert their effect on account balances.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError, NotFoundError } from '@/shared/lib/middleware/error-handler';
import { deleteTransactionsSchema } from '@/shared/lib/validators/schemas';

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const { transactionIds } = deleteTransactionsSchema.parse(await req.json());

    const transactions = await prisma.transaction.findMany({
      where: { id: { in: transactionIds }, userId },
    });
    if (transactions.length === 0) throw new NotFoundError('Transactions');

    // Net balance change to revert, per account
    const revert = new Map<string, number>();
    for (const t of transactions) {
      const amount = Number(t.amount);
      revert.set(t.accountId, (revert.get(t.accountId) ?? 0) + (t.type === 'EXPENSE' ? amount : -amount));
    }

    await prisma.$transaction(async (tx) => {
      for (const [accountId, change] of revert) {
        await tx.account.update({ where: { id: accountId }, data: { balance: { increment: change } } });
      }
      await tx.transaction.deleteMany({ where: { id: { in: transactions.map((t) => t.id) }, userId } });
    });

    return NextResponse.json({ message: `Successfully deleted ${transactions.length} transactions` });
  } catch (error) {
    return handleApiError(error);
  }
}
