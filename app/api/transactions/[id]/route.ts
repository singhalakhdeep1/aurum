/**
 * Transaction Details API Routes
 * GET, PUT, DELETE operations for individual transactions
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError, NotFoundError } from '@/shared/lib/middleware/error-handler';
import { updateTransactionSchema, deleteTransactionsSchema } from '@/shared/lib/validators/schemas';

// GET /api/transactions/[id] - Get transaction by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = params;
    
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
      include: { account: true },
    });
    
    if (!transaction) {
      throw new NotFoundError('Transaction');
    }
    
    return NextResponse.json(transaction);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/transactions/[id] - Update transaction
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = params;
    const body = await req.json();
    
    const validatedData = updateTransactionSchema.parse(body);
    
    // Check if transaction exists and belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: { id, userId },
      include: { account: true },
    });
    
    if (!existingTransaction) {
      throw new NotFoundError('Transaction');
    }
    
    const transaction = await prisma.$transaction(async (tx) => {
      // Calculate balance change
      const oldBalanceChange = existingTransaction.type === 'EXPENSE' 
        ? -existingTransaction.amount 
        : existingTransaction.amount;
      
      const newBalanceChange = validatedData.type === 'EXPENSE' 
        ? -validatedData.amount 
        : validatedData.amount;
      
      const balanceDifference = newBalanceChange - oldBalanceChange;
      
      // Update transaction
      const updatedTransaction = await tx.transaction.update({
        where: { id },
        data: {
          ...validatedData,
          date: validatedData.date ? new Date(validatedData.date) : undefined,
        },
      });
      
      // Update account balance if amount or type changed
      if (validatedData.amount !== undefined || validatedData.type !== undefined) {
        await tx.account.update({
          where: { id: existingTransaction.accountId },
          data: {
            balance: {
              increment: balanceDifference,
            },
          },
        });
      }
      
      return updatedTransaction;
    });
    
    return NextResponse.json(transaction);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/transactions/[id] - Delete transaction
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth(req);
    const { id } = params;
    
    // Check if transaction exists and belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });
    
    if (!existingTransaction) {
      throw new NotFoundError('Transaction');
    }
    
    await prisma.$transaction(async (tx) => {
      // Calculate balance change to revert
      const balanceChange = existingTransaction.type === 'EXPENSE' 
        ? existingTransaction.amount 
        : -existingTransaction.amount;
      
      // Update account balance
      await tx.account.update({
        where: { id: existingTransaction.accountId },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      });
      
      // Delete transaction
      await tx.transaction.delete({
        where: { id },
      });
    });
    
    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/transactions/bulk-delete - Delete multiple transactions
export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const body = await req.json();
    
    const { transactionIds } = deleteTransactionsSchema.parse(body);
    
    // Get transactions to delete
    const transactions = await prisma.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId,
      },
    });
    
    if (transactions.length === 0) {
      throw new NotFoundError('Transactions');
    }
    
    await prisma.$transaction(async (tx) => {
      // Group transactions by account to update balances
      const accountBalanceChanges = transactions.reduce((acc, transaction) => {
        const change =
          transaction.type === 'EXPENSE'
            ? transaction.amount
            : -transaction.amount;
        acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
        return acc;
      }, {} as Record<string, number>);
      
      // Update account balances
      for (const [accountId, change] of Object.entries(accountBalanceChanges)) {
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: change,
            },
          },
        });
      }
      
      // Delete transactions
      await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId,
        },
      });
    });
    
    return NextResponse.json({ 
      message: `Successfully deleted ${transactions.length} transactions` 
    });
  } catch (error) {
    return handleApiError(error);
  }
}
