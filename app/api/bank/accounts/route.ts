/** GET /api/bank/accounts - Linked bank accounts for the signed-in user. */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError } from '@/shared/lib/middleware/error-handler';

export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const links = await prisma.linkedBankAccount.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      links.map((l) => ({
        id: l.id,
        bankName: l.institutionName,
        accountName: l.name,
        accountNumber: l.mask ? `•••• ${l.mask}` : '••••',
        balance: Number(l.balance),
        status: 'active',
        lastSync: l.lastSyncedAt?.toISOString() ?? null,
      }))
    );
  } catch (error) {
    return handleApiError(error);
  }
}
