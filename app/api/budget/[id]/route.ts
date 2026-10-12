/**
 * Budget Details API Routes
 * GET, PUT, DELETE operations for individual budgets
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError, NotFoundError } from '@/shared/lib/middleware/error-handler';
import { updateBudgetSchema } from '@/shared/lib/validators/schemas';

// GET /api/budget/[id] - Get budget by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = await params;
    
    const budget = await prisma.budget.findFirst({
      where: { id, userId },
    });
    
    if (!budget) {
      throw new NotFoundError('Budget');
    }
    
    return NextResponse.json(budget);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/budget/[id] - Update budget
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = await params;
    const body = await req.json();
    
    const validatedData = updateBudgetSchema.parse(body);
    
    // Check if budget exists and belongs to user
    const existingBudget = await prisma.budget.findFirst({
      where: { id, userId },
    });
    
    if (!existingBudget) {
      throw new NotFoundError('Budget');
    }
    
    const budget = await prisma.budget.update({
      where: { id },
      data: validatedData,
    });
    
    return NextResponse.json(budget);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/budget/[id] - Delete budget
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = await params;
    
    // Check if budget exists and belongs to user
    const existingBudget = await prisma.budget.findFirst({
      where: { id, userId },
    });
    
    if (!existingBudget) {
      throw new NotFoundError('Budget');
    }
    
    // Delete budget
    await prisma.budget.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
