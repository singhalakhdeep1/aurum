/**
 * Derives a user's XP, level and achievements from their real financial data.
 * Nothing here is stored: it is recomputed on every profile load.
 */

import { prisma } from '@/shared/lib/db/prisma';
import { calculateLevel, experienceToNextLevel, getAllAchievements } from './gamification';

// Achievements whose progress can be measured from stored data.
// (Login streaks and social achievements are not tracked, so they are not shown.)
const TRACKED = new Set([
  'first_savings',
  'savings_1000',
  'savings_10000',
  'savings_100000',
  'first_investment',
  'diverse_portfolio',
  'profit_1000',
  'budget_master',
  'expense_tracker',
]);

/** Number of most recent consecutive full months (max 3) spent within budget. */
function monthsUnderBudget(expenseByMonth: Map<string, number>, budget: number): number {
  const now = new Date();
  let streak = 0;
  for (let i = 1; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!expenseByMonth.has(key) || (expenseByMonth.get(key) ?? 0) > budget) break;
    streak++;
  }
  return streak;
}

export async function getProfileStats(userId: string) {
  const [user, accounts, expenseCount, txCount, budget, investments, subscriptionCount, receiptCount, expenses] =
    await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { id: userId } }),
      prisma.account.findMany({ where: { userId }, select: { balance: true } }),
      prisma.transaction.count({ where: { userId, type: 'EXPENSE' } }),
      prisma.transaction.count({ where: { userId } }),
      prisma.budget.findUnique({ where: { userId } }),
      prisma.investment.findMany({ where: { userId } }),
      prisma.subscription.count({ where: { userId } }),
      prisma.receipt.count({ where: { userId, status: 'success' } }),
      prisma.transaction.findMany({
        where: { userId, type: 'EXPENSE', date: { gte: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1) } },
        select: { amount: true, date: true },
      }),
    ]);

  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);
  const assetTypes = new Set(investments.map((i) => i.type)).size;
  const profit = investments.reduce(
    (sum, i) => sum + (Number(i.currentPrice) - Number(i.averageCost)) * Number(i.quantity),
    0
  );

  const expenseByMonth = new Map<string, number>();
  for (const e of expenses) {
    const key = `${e.date.getFullYear()}-${e.date.getMonth()}`;
    expenseByMonth.set(key, (expenseByMonth.get(key) ?? 0) + Number(e.amount));
  }

  const xp =
    txCount * 10 + accounts.length * 50 + (budget ? 100 : 0) + investments.length * 25 + subscriptionCount * 20 + receiptCount * 5;
  const level = calculateLevel(xp);

  const progressById: Record<string, number> = {
    first_savings: totalBalance,
    savings_1000: totalBalance,
    savings_10000: totalBalance,
    savings_100000: totalBalance,
    first_investment: investments.length,
    diverse_portfolio: assetTypes,
    profit_1000: profit,
    budget_master: budget ? monthsUnderBudget(expenseByMonth, Number(budget.amount)) : 0,
    expense_tracker: expenseCount,
  };

  const achievements = getAllAchievements()
    .filter((a) => TRACKED.has(a.id))
    .map((a) => {
      const progress = Math.max(0, Math.min(progressById[a.id] ?? 0, a.maxProgress));
      return {
        id: a.id,
        name: a.name,
        description: a.description,
        icon: a.icon,
        progress,
        maxProgress: a.maxProgress,
        unlocked: progress >= a.maxProgress,
      };
    });

  return {
    name: user.name ?? '',
    email: user.email,
    imageUrl: user.imageUrl,
    memberSince: user.createdAt.toISOString(),
    level,
    xp,
    nextLevelXp: experienceToNextLevel(level),
    achievements,
  };
}
