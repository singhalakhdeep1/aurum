/**
 * Investment Details API Routes
 * GET, PUT, DELETE operations for individual investments
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError, NotFoundError } from '@/shared/lib/middleware/error-handler';
import { updateInvestmentSchema } from '@/shared/lib/validators/schemas';

// GET /api/investments/[id] - Get investment by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = params;
    
    const investment = await prisma.investment.findFirst({
      where: { id, userId },
    });
    
    if (!investment) {
      throw new NotFoundError('Investment');
    }
    
    return NextResponse.json(investment);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/investments/[id] - Update investment
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = params;
    const body = await req.json();
    
    const validatedData = updateInvestmentSchema.parse(body);
    
    // Check if investment exists and belongs to user
    const existingInvestment = await prisma.investment.findFirst({
      where: { id, userId },
    });
    
    if (!existingInvestment) {
      throw new NotFoundError('Investment');
    }
    
    const investment = await prisma.investment.update({
      where: { id },
      data: {
        ...validatedData,
        purchaseDate: validatedData.purchaseDate ? new Date(validatedData.purchaseDate) : undefined,
      },
    });
    
    return NextResponse.json(investment);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/investments/[id] - Delete investment
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = params;
    
    // Check if investment exists and belongs to user
    const existingInvestment = await prisma.investment.findFirst({
      where: { id, userId },
    });
    
    if (!existingInvestment) {
      throw new NotFoundError('Investment');
    }
    
    // Delete investment
    await prisma.investment.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Investment deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
