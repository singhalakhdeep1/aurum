/**
 * Transactions API Routes
 * CRUD operations for user transactions
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError } from '@/shared/lib/middleware/error-handler';
import { createTransactionSchema, paginationSchema } from '@/shared/lib/validators/schemas';

// GET /api/transactions - Get all transactions for authenticated user
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    
    const { searchParams } = new URL(req.url);
    const { page, pageSize } = paginationSchema.parse({
      page: searchParams.get('page'),
      pageSize: searchParams.get('pageSize'),
    });
    
    const accountId = searchParams.get('accountId');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const where: any = { userId };
    
    if (accountId) where.accountId = accountId;
    if (type) where.type = type;
    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }
    
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: { account: true },
        orderBy: { date: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.transaction.count({ where }),
    ]);
    
    return NextResponse.json({
      data: transactions,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const body = await req.json();
    
    const validatedData = createTransactionSchema.parse(body);
    
    const transaction = await prisma.$transaction(async (tx) => {
      // Create transaction
      const newTransaction = await tx.transaction.create({
        data: {
          ...validatedData,
          date: new Date(validatedData.date),
          userId,
        },
      });
      
      // Update account balance
      const balanceChange = validatedData.type === 'EXPENSE' 
        ? -validatedData.amount 
        : validatedData.amount;
      
      await tx.account.update({
        where: { id: validatedData.accountId },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      });
      
      return newTransaction;
    });
    
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
