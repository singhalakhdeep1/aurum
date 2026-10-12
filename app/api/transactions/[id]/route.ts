/**
 * Transaction Details API Routes
 * GET, PUT, DELETE operations for individual transactions.
 * Every write keeps the owning account balance in sync.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError, NotFoundError } from '@/shared/lib/middleware/error-handler';
import { updateTransactionSchema } from '@/shared/lib/validators/schemas';

type TxType = 'INCOME' | 'EXPENSE';

/** Signed effect of a transaction on its account balance. */
function balanceEffect(type: TxType, amount: number): number {
  return type === 'EXPENSE' ? -amount : amount;
}

type Ctx = { params: Promise<{ id: string }> };

// GET /api/transactions/[id]
export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    const userId = await requireAuth(req);
    const { id } = await params;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
      include: { account: true },
    });
    if (!transaction) throw new NotFoundError('Transaction');

    return NextResponse.json(transaction);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/transactions/[id]
export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const userId = await requireAuth(req);
    const { id } = await params;
    const data = updateTransactionSchema.parse(await req.json());

    const existing = await prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Transaction');

    if (data.accountId && data.accountId !== existing.accountId) {
      const target = await prisma.account.findFirst({ where: { id: data.accountId, userId } });
      if (!target) throw new NotFoundError('Account');
    }

    const oldEffect = balanceEffect(existing.type, Number(existing.amount));
    const newEffect = balanceEffect(data.type ?? existing.type, data.amount ?? Number(existing.amount));
    const newAccountId = data.accountId ?? existing.accountId;

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.transaction.update({
        where: { id },
        data: {
          ...data,
          date: data.date ? new Date(data.date) : undefined,
        },
      });

      if (newAccountId === existing.accountId) {
        const diff = newEffect - oldEffect;
        if (diff !== 0) {
          await tx.account.update({ where: { id: newAccountId }, data: { balance: { increment: diff } } });
        }
      } else {
        // Moved between accounts: undo on the old one, apply on the new one
        await tx.account.update({ where: { id: existing.accountId }, data: { balance: { increment: -oldEffect } } });
        await tx.account.update({ where: { id: newAccountId }, data: { balance: { increment: newEffect } } });
      }

      return result;
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/transactions/[id]
export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    const userId = await requireAuth(req);
    const { id } = await params;

    const existing = await prisma.transaction.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Transaction');

    await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: existing.accountId },
        data: { balance: { increment: -balanceEffect(existing.type, Number(existing.amount)) } },
      });
      await tx.transaction.delete({ where: { id } });
    });

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
