/** POST /api/bank/sync - Import new transactions for one linked account (or all). */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError, NotFoundError } from '@/shared/lib/middleware/error-handler';
import { syncBankItem } from '@/shared/lib/bank/sync';

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const body = await req.json().catch(() => ({}));
    const id = typeof body?.id === 'string' ? body.id : undefined;

    const links = await prisma.linkedBankAccount.findMany({
      where: { userId, ...(id ? { id } : {}) },
      select: { plaidItemId: true },
    });
    if (id && links.length === 0) throw new NotFoundError('Linked account');

    const itemIds = [...new Set(links.map((l) => l.plaidItemId))];
    let added = 0;
    for (const itemId of itemIds) added += (await syncBankItem(itemId)).added;

    return NextResponse.json({ synced: itemIds.length, added });
  } catch (error) {
    return handleApiError(error);
  }
}
