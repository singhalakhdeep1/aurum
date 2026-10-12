/**
 * Accounts API Routes
 * CRUD operations for user accounts
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError } from '@/shared/lib/middleware/error-handler';
import { createAccountSchema } from '@/shared/lib/validators/schemas';

// GET /api/accounts - Get all accounts for authenticated user
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    
    const [accounts, total] = await Promise.all([
      prisma.account.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.account.count({ where: { userId } }),
    ]);
    
    return NextResponse.json({
      data: accounts,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/accounts - Create a new account
export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const body = await req.json();
    
    const validatedData = createAccountSchema.parse(body);
    
    // If this is set as default, unset default for other accounts
    if (validatedData.isDefault) {
      await prisma.account.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }
    
    const account = await prisma.account.create({
      data: {
        ...validatedData,
        userId,
      },
    });
    
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
