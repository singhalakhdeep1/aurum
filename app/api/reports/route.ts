/**
 * GET /api/reports - Six-month income/expense trend, this month's expense
 * breakdown by category, and plain-language insights derived from the data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/db/prisma';
import { requireAuth } from '@/shared/lib/middleware/auth';
import { handleApiError } from '@/shared/lib/middleware/error-handler';

const MONTHS = 6;

const monthLabel = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const titleCase = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth(req);
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - (MONTHS - 1), 1);

    const [transactions, budget] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId, date: { gte: start }, status: { not: 'FAILED' } },
        select: { type: true, amount: true, date: true, category: true },
      }),
      prisma.budget.findUnique({ where: { userId } }),
    ]);

    const buckets = Array.from({ length: MONTHS }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (MONTHS - 1 - i), 1);
      return { key: `${d.getFullYear()}-${d.getMonth()}`, month: monthLabel(d), income: 0, expenses: 0 };
    });
    const byKey = new Map(buckets.map((b) => [b.key, b]));
    const thisMonthCategories = new Map<string, number>();
    const thisKey = `${now.getFullYear()}-${now.getMonth()}`;

    for (const t of transactions) {
      const key = `${t.date.getFullYear()}-${t.date.getMonth()}`;
      const bucket = byKey.get(key);
      if (!bucket) continue;
      const amount = Number(t.amount);
      if (t.type === 'INCOME') bucket.income += amount;
      else {
        bucket.expenses += amount;
        if (key === thisKey) thisMonthCategories.set(t.category, (thisMonthCategories.get(t.category) ?? 0) + amount);
      }
    }

    const monthlyData = buckets.map(({ month, income, expenses }) => ({
      month,
      income: Math.round(income * 100) / 100,
      expenses: Math.round(expenses * 100) / 100,
      savings: Math.round((income - expenses) * 100) / 100,
    }));

    const totalExpenses = [...thisMonthCategories.values()].reduce((a, b) => a + b, 0);
    const categoryBreakdown = [...thisMonthCategories.entries()]
      .map(([category, amount]) => ({
        category: titleCase(category),
        amount: Math.round(amount * 100) / 100,
        percentage: totalExpenses ? Math.round((amount / totalExpenses) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Insights
    const insights: string[] = [];
    const current = monthlyData[MONTHS - 1];
    const previous = monthlyData[MONTHS - 2];

    if (previous.expenses > 0) {
      const change = ((current.expenses - previous.expenses) / previous.expenses) * 100;
      if (Math.abs(change) >= 5) {
        insights.push(
          `Your spending is ${Math.abs(Math.round(change))}% ${change > 0 ? 'higher' : 'lower'} than last month (${money(current.expenses)} vs ${money(previous.expenses)}).`
        );
      }
    }
    if (categoryBreakdown[0]) {
      insights.push(
        `${categoryBreakdown[0].category} is your biggest expense this month at ${money(categoryBreakdown[0].amount)} (${categoryBreakdown[0].percentage}% of spending).`
      );
    }
    if (current.income > 0) {
      const rate = Math.round((current.savings / current.income) * 100);
      insights.push(
        rate >= 20
          ? `You are saving ${rate}% of your income this month, which is a healthy rate.`
          : rate >= 0
            ? `You are saving ${rate}% of your income this month. Aiming for 20% or more builds a stronger safety net.`
            : `You have spent ${money(-current.savings)} more than you earned this month.`
      );
    }
    if (budget) {
      const limit = Number(budget.amount);
      const used = Math.round((current.expenses / limit) * 100);
      insights.push(
        used >= 100
          ? `You have exceeded your ${money(limit)} monthly budget (${used}% used).`
          : `You have used ${used}% of your ${money(limit)} monthly budget.`
      );
    }
    if (insights.length === 0) insights.push('Add a few transactions to start seeing personalised insights.');

    return NextResponse.json({ monthlyData, categoryBreakdown, insights });
  } catch (error) {
    return handleApiError(error);
  }
}
