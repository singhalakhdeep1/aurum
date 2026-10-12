/**
 * Account Details API Routes
 * GET, PUT, DELETE operations for individual accounts
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError, NotFoundError } from '@/shared/lib/middleware/error-handler';
import { updateAccountSchema } from '@/shared/lib/validators/schemas';

// GET /api/accounts/[id] - Get account by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = await params;
    
    const account = await prisma.account.findFirst({
      where: { id, userId },
    });
    
    if (!account) {
      throw new NotFoundError('Account');
    }
    
    return NextResponse.json(account);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/accounts/[id] - Update account
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = await params;
    const body = await req.json();
    
    const validatedData = updateAccountSchema.parse(body);
    
    // Check if account exists and belongs to user
    const existingAccount = await prisma.account.findFirst({
      where: { id, userId },
    });
    
    if (!existingAccount) {
      throw new NotFoundError('Account');
    }
    
    // If setting as default, unset default for other accounts
    if (validatedData.isDefault) {
      await prisma.account.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }
    
    const account = await prisma.account.update({
      where: { id },
      data: validatedData,
    });
    
    return NextResponse.json(account);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/accounts/[id] - Delete account
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = await params;
    
    // Check if account exists and belongs to user
    const existingAccount = await prisma.account.findFirst({
      where: { id, userId },
    });
    
    if (!existingAccount) {
      throw new NotFoundError('Account');
    }
    
    // Delete account
    await prisma.account.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
