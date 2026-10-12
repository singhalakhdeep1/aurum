/**
 * DELETE /api/bank/accounts/[id] - Unlink a bank connection.
 * Local accounts and already-imported transactions are kept.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError, NotFoundError } from '@/shared/lib/middleware/error-handler';
import { removeItem } from '@/shared/lib/bank/plaid';
import { decryptToken } from '@/shared/lib/security/token-crypto';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = await params;

    const link = await prisma.linkedBankAccount.findFirst({ where: { id, userId } });
    if (!link) throw new NotFoundError('Linked account');

    // The Plaid item is shared by every account from the same institution login,
    // so only revoke it once the last account is unlinked.
    const siblings = await prisma.linkedBankAccount.count({
      where: { plaidItemId: link.plaidItemId, userId, id: { not: id } },
    });
    if (siblings === 0) {
      try {
        await removeItem(decryptToken(link.accessToken));
      } catch (err) {
        console.error('Plaid item removal failed (continuing with local unlink):', err);
      }
    }

    await prisma.linkedBankAccount.delete({ where: { id } });
    return NextResponse.json({ message: 'Account unlinked' });
  } catch (error) {
    return handleApiError(error);
  }
}
