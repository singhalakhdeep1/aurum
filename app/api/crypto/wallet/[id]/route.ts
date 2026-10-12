/** DELETE /api/crypto/wallet/[id] - Stop watching an address. */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError, NotFoundError } from '@/shared/lib/middleware/error-handler';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = await params;

    const { count } = await prisma.walletAddress.deleteMany({ where: { id, userId } });
    if (count === 0) throw new NotFoundError('Wallet');

    return NextResponse.json({ message: 'Wallet removed' });
  } catch (error) {
    return handleApiError(error);
  }
}
