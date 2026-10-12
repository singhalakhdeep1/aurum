/**
 * POST /api/subscriptions/[id]/cancel - Cancel a tracked subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError, NotFoundError } from '@/shared/lib/middleware/error-handler';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = await params;

    const existing = await prisma.subscription.findFirst({ where: { id, userId } });
    if (!existing) throw new NotFoundError('Subscription');

    const subscription = await prisma.subscription.update({
      where: { id },
      data: { status: 'cancelled', autoRenew: false },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    return handleApiError(error);
  }
}
