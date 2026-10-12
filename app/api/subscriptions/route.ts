/**
 * Subscriptions API Routes
 * CRUD operations for user subscriptions
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError } from '@/shared/lib/middleware/error-handler';
import { createSubscriptionSchema, paginationSchema } from '@/shared/lib/validators/schemas';

// GET /api/subscriptions - Get all subscriptions for authenticated user
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    
    const { searchParams } = new URL(req.url);
    const { page, pageSize } = paginationSchema.parse({
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
    });
    
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    
    const where: any = { userId };
    if (status) where.status = status;
    if (category) where.category = category;
    
    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        orderBy: { nextBillingDate: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.subscription.count({ where }),
    ]);
    
    return NextResponse.json({
      data: subscriptions,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/subscriptions - Create a new subscription
export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const body = await req.json();
    
    const validatedData = createSubscriptionSchema.parse(body);
    
    const subscription = await prisma.subscription.create({
      data: {
        ...validatedData,
        id: crypto.randomUUID(),
        nextBillingDate: new Date(validatedData.nextBillingDate),
        freeTrialEnd: validatedData.freeTrialEnd ? new Date(validatedData.freeTrialEnd) : null,
        userId,
      },
    });
    
    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
