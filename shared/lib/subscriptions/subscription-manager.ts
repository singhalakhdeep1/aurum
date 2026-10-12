/**
 * Subscription Management Service
 * Track, manage, and analyze recurring subscriptions
 */

export interface Subscription {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  billingCycle: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextBillingDate: Date;
  category: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  autoRenew: boolean;
  freeTrialEnd?: Date;
  logo?: string;
  website?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionAnalytics {
  totalMonthlyCost: number;
  totalYearlyCost: number;
  activeSubscriptions: number;
  upcomingBills: Array<{
    subscription: string;
    amount: number;
    date: Date;
  }>;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  potentialSavings: number;
}

export interface SubscriptionInsight {
  type: 'duplicate' | 'unused' | 'expensive' | 'trial_ending' | 'price_increase';
  message: string;
  subscriptionId: string;
  severity: 'low' | 'medium' | 'high';
  action?: string;
}

/**
 * Calculate monthly cost from billing cycle
 */
export function calculateMonthlyCost(subscription: Subscription): number {
  switch (subscription.billingCycle) {
    case 'daily':
      return subscription.amount * 30;
    case 'weekly':
      return subscription.amount * 4.33;
    case 'monthly':
      return subscription.amount;
    case 'quarterly':
      return subscription.amount / 3;
    case 'yearly':
      return subscription.amount / 12;
    default:
      return subscription.amount;
  }
}

/**
 * Calculate yearly cost from billing cycle
 */
export function calculateYearlyCost(subscription: Subscription): number {
  switch (subscription.billingCycle) {
    case 'daily':
      return subscription.amount * 365;
    case 'weekly':
      return subscription.amount * 52;
    case 'monthly':
      return subscription.amount * 12;
    case 'quarterly':
      return subscription.amount * 4;
    case 'yearly':
      return subscription.amount;
    default:
      return subscription.amount * 12;
  }
}

/**
 * Get next billing date based on cycle
 */
export function getNextBillingDate(subscription: Subscription): Date {
  const now = new Date();
  const nextBilling = new Date(subscription.nextBillingDate);
  
  // If next billing is in the past, calculate next occurrence
  if (nextBilling < now) {
    switch (subscription.billingCycle) {
      case 'daily':
        nextBilling.setDate(nextBilling.getDate() + 1);
        break;
      case 'weekly':
        nextBilling.setDate(nextBilling.getDate() + 7);
        break;
      case 'monthly':
        nextBilling.setMonth(nextBilling.getMonth() + 1);
        break;
      case 'quarterly':
        nextBilling.setMonth(nextBilling.getMonth() + 3);
        break;
      case 'yearly':
        nextBilling.setFullYear(nextBilling.getFullYear() + 1);
        break;
    }
  }
  
  return nextBilling;
}

/**
 * Generate subscription analytics
 */
export function generateSubscriptionAnalytics(subscriptions: Subscription[]): SubscriptionAnalytics {
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  
  const totalMonthlyCost = activeSubscriptions.reduce((sum, sub) => sum + calculateMonthlyCost(sub), 0);
  const totalYearlyCost = activeSubscriptions.reduce((sum, sub) => sum + calculateYearlyCost(sub), 0);
  
  // Upcoming bills (next 30 days)
  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const upcomingBills = activeSubscriptions
    .map(sub => ({
      subscription: sub.name,
      amount: sub.amount,
      date: getNextBillingDate(sub),
    }))
    .filter(bill => bill.date <= thirtyDaysLater)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  activeSubscriptions.forEach(sub => {
    const monthlyCost = calculateMonthlyCost(sub);
    categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + monthlyCost;
  });
  
  const categoryBreakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalMonthlyCost > 0 ? (amount / totalMonthlyCost) * 100 : 0,
  })).sort((a, b) => b.amount - a.amount);
  
  // Potential savings (paused or cancelled subscriptions)
  const potentialSavings = subscriptions
    .filter(sub => sub.status === 'paused' || sub.status === 'cancelled')
    .reduce((sum, sub) => sum + calculateMonthlyCost(sub), 0);
  
  return {
    totalMonthlyCost,
    totalYearlyCost,
    activeSubscriptions: activeSubscriptions.length,
    upcomingBills,
    categoryBreakdown,
    potentialSavings,
  };
}

/**
 * Generate subscription insights
 */
export function generateSubscriptionInsights(subscriptions: Subscription[]): SubscriptionInsight[] {
  const insights: SubscriptionInsight[] = [];
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  
  // Check for duplicate subscriptions
  const nameCounts: Record<string, number> = {};
  activeSubscriptions.forEach(sub => {
    const normalizedName = sub.name.toLowerCase().trim();
    nameCounts[normalizedName] = (nameCounts[normalizedName] || 0) + 1;
  });
  
  Object.entries(nameCounts).forEach(([name, count]) => {
    if (count > 1) {
      const duplicateSubs = activeSubscriptions.filter(
        sub => sub.name.toLowerCase().trim() === name
      );
      duplicateSubs.forEach(sub => {
        insights.push({
          type: 'duplicate',
          message: `You have ${count} subscriptions to ${sub.name}. Consider consolidating.`,
          subscriptionId: sub.id,
          severity: 'medium',
          action: 'Review and consolidate duplicate subscriptions',
        });
      });
    }
  });
  
  // Check for expensive subscriptions (top 10% by cost)
  const monthlyCosts = activeSubscriptions.map(sub => ({
    sub,
    cost: calculateMonthlyCost(sub),
  })).sort((a, b) => b.cost - a.cost);
  
  const expensiveThreshold = monthlyCosts[Math.floor(monthlyCosts.length * 0.1)]?.cost || 0;
  
  monthlyCosts.forEach(({ sub, cost }) => {
    if (cost >= expensiveThreshold && cost > 50) {
      insights.push({
        type: 'expensive',
        message: `${sub.name} costs $${cost.toFixed(2)}/month, which is one of your most expensive subscriptions.`,
        subscriptionId: sub.id,
        severity: 'medium',
        action: 'Consider downgrading or cancelling if not heavily used',
      });
    }
  });
  
  // Check for trials ending soon
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  activeSubscriptions.forEach(sub => {
    if (sub.freeTrialEnd && sub.freeTrialEnd <= sevenDaysLater && sub.freeTrialEnd > now) {
      insights.push({
        type: 'trial_ending',
        message: `Free trial for ${sub.name} ends on ${sub.freeTrialEnd.toLocaleDateString()}.`,
        subscriptionId: sub.id,
        severity: 'high',
        action: 'Decide whether to continue or cancel before trial ends',
      });
    }
  });
  
  return insights;
}

/**
 * Suggest subscription alternatives
 */
export function suggestAlternatives(subscription: Subscription): Array<{
  name: string;
  description: string;
  potentialSavings: number;
  url?: string;
}> {
  const alternatives: Array<{ name: string; description: string; potentialSavings: number; url?: string }> = [];
  const monthlyCost = calculateMonthlyCost(subscription);
  
  // Common subscription alternatives
  const alternativeMap: Record<string, Array<{ name: string; description: string; savings: number; url?: string }>> = {
    'netflix': [
      { name: 'Netflix Basic', description: 'Lower tier with ads', savings: monthlyCost * 0.5 },
      { name: 'Free alternatives', description: 'Tubi, Pluto TV, or library services', savings: monthlyCost },
    ],
    'spotify': [
      { name: 'Spotify Free', description: 'Ad-supported version', savings: monthlyCost },
      { name: 'YouTube Music', description: 'Often included with YouTube Premium', savings: monthlyCost * 0.2 },
    ],
    'adobe': [
      { name: 'Alternative tools', description: 'Canva, Figma, or GIMP for design', savings: monthlyCost * 0.9 },
      { name: 'Adobe Photography Plan', description: 'If you only need Photoshop/Lightroom', savings: monthlyCost * 0.5 },
    ],
  };
  
  const normalizedName = subscription.name.toLowerCase();
  for (const [key, alts] of Object.entries(alternativeMap)) {
    if (normalizedName.includes(key)) {
      alts.forEach(alt => {
        alternatives.push({
          name: alt.name,
          description: alt.description,
          potentialSavings: alt.savings,
          url: alt.url,
        });
      });
    }
  }
  
  return alternatives;
}

/**
 * Format billing cycle for display
 */
export function formatBillingCycle(cycle: Subscription['billingCycle']): string {
  const cycleMap: Record<Subscription['billingCycle'], string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
  };
  
  return cycleMap[cycle] || cycle;
}

/**
 * Get subscription status color
 */
export function getSubscriptionStatusColor(status: Subscription['status']): string {
  const colorMap: Record<Subscription['status'], string> = {
    active: 'text-green-500',
    paused: 'text-yellow-500',
    cancelled: 'text-red-500',
    expired: 'text-gray-500',
  };
  
  return colorMap[status] || 'text-gray-500';
}
