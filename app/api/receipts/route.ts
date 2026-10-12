/** GET /api/receipts - History of receipt scans. */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError } from '@/shared/lib/middleware/error-handler';

export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const receipts = await prisma.receipt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json(
      receipts.map((r) => ({
        id: r.id,
        merchant: r.merchant ?? 'Unknown merchant',
        date: (r.date ?? r.createdAt).toISOString(),
        amount: r.amount ? Number(r.amount) : 0,
        status: r.status === 'success' ? 'success' : 'failed',
      }))
    );
  } catch (error) {
    return handleApiError(error);
  }
}
