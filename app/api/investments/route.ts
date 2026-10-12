/**
 * Investments API Routes
 * CRUD operations for user investments
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError } from '@/shared/lib/middleware/error-handler';
import { createInvestmentSchema, paginationSchema } from '@/shared/lib/validators/schemas';

// GET /api/investments - Get all investments for authenticated user
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    
    const { searchParams } = new URL(req.url);
    const { page, pageSize } = paginationSchema.parse({
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
    });
    
    const type = searchParams.get('type');
    const sector = searchParams.get('sector');
    
    const where: any = { userId };
    if (type) where.type = type;
    if (sector) where.sector = sector;
    
    const [investments, total] = await Promise.all([
      prisma.investment.findMany({
        where,
        orderBy: { purchaseDate: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.investment.count({ where }),
    ]);
    
    return NextResponse.json({
      data: investments,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/investments - Create a new investment
export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const body = await req.json();
    
    const validatedData = createInvestmentSchema.parse(body);
    
    const investment = await prisma.investment.create({
      data: {
        ...validatedData,
        id: crypto.randomUUID(),
        purchaseDate: new Date(validatedData.purchaseDate),
        userId,
      },
    });
    
    return NextResponse.json(investment, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
