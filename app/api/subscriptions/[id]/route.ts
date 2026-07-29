/**
 * Subscription Details API Routes
 * GET, PUT, DELETE operations for individual subscriptions
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError, NotFoundError } from '@/shared/lib/middleware/error-handler';
import { updateSubscriptionSchema } from '@/shared/lib/validators/schemas';

// GET /api/subscriptions/[id] - Get subscription by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = params;
    
    const subscription = await prisma.subscription.findFirst({
      where: { id, userId },
    });
    
    if (!subscription) {
      throw new NotFoundError('Subscription');
    }
    
    return NextResponse.json(subscription);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/subscriptions/[id] - Update subscription
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = params;
    const body = await req.json();
    
    const validatedData = updateSubscriptionSchema.parse(body);
    
    // Check if subscription exists and belongs to user
    const existingSubscription = await prisma.subscription.findFirst({
      where: { id, userId },
    });
    
    if (!existingSubscription) {
      throw new NotFoundError('Subscription');
    }
    
    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        ...validatedData,
        nextBillingDate: validatedData.nextBillingDate ? new Date(validatedData.nextBillingDate) : undefined,
        freeTrialEnd: validatedData.freeTrialEnd ? new Date(validatedData.freeTrialEnd) : undefined,
      },
    });
    
    return NextResponse.json(subscription);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/subscriptions/[id] - Delete subscription
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = params;
    
    // Check if subscription exists and belongs to user
    const existingSubscription = await prisma.subscription.findFirst({
      where: { id, userId },
    });
    
    if (!existingSubscription) {
      throw new NotFoundError('Subscription');
    }
    
    // Delete subscription
    await prisma.subscription.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/subscriptions/[id]/cancel - Cancel subscription
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = params;
    
    // Check if subscription exists and belongs to user
    const existingSubscription = await prisma.subscription.findFirst({
      where: { id, userId },
    });
    
    if (!existingSubscription) {
      throw new NotFoundError('Subscription');
    }
    
    // Cancel subscription
    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: 'cancelled',
        autoRenew: false,
      },
    });
    
    return NextResponse.json(subscription);
  } catch (error) {
    return handleApiError(error);
  }
}
