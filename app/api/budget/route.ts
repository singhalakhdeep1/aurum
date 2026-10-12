/**
 * Budget API Routes
 * Each user has a single monthly spending budget.
 *
 * GET  /api/budget - Budget plus this month's spending and per-category breakdown
 * POST /api/budget - Create or replace the monthly budget
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError } from '@/shared/lib/middleware/error-handler';
import { createBudgetSchema } from '@/shared/lib/validators/schemas';

export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [budget, byCategory] = await Promise.all([
      prisma.budget.findUnique({ where: { userId } }),
      prisma.transaction.groupBy({
        by: ['category'],
        where: { userId, type: 'EXPENSE', status: { not: 'FAILED' }, date: { gte: monthStart, lt: monthEnd } },
        _sum: { amount: true },
      }),
    ]);

    const categories = byCategory
      .map((c) => ({ category: c.category, spent: Number(c._sum.amount ?? 0) }))
      .sort((a, b) => b.spent - a.spent);
    const spent = categories.reduce((sum, c) => sum + c.spent, 0);
    const amount = budget ? Number(budget.amount) : null;

    return NextResponse.json({
      budget: budget ? { id: budget.id, amount } : null,
      spent,
      remaining: amount === null ? null : amount - spent,
      percentage: amount ? Math.round((spent / amount) * 1000) / 10 : 0,
      categories,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const { amount } = createBudgetSchema.parse(await req.json());

    const budget = await prisma.budget.upsert({
      where: { userId },
      update: { amount },
      create: { amount, userId },
    });
    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
