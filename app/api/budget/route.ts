/**
 * Budget API Routes
 * CRUD operations for user budgets
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError, NotFoundError } from '@/shared/lib/middleware/error-handler';
import { createBudgetSchema, updateBudgetSchema } from '@/shared/lib/validators/schemas';

// GET /api/budget - Get all budgets for authenticated user
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    
    const budgets = await prisma.budget.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(budgets);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/budget - Create a new budget
export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const body = await req.json();
    
    const validatedData = createBudgetSchema.parse(body);
    
    const budget = await prisma.budget.create({
      data: {
        ...validatedData,
        userId,
      },
    });
    
    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
