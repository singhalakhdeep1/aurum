/**
 * Investment Portfolio Tracking Service
 * Track stocks, ETFs, mutual funds, and other investments
 */

export interface Investment {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'etf' | 'mutual_fund' | 'bond' | 'crypto' | 'real_estate' | 'other';
  quantity: number;
  averageCost: number;
  currentPrice: number;
  /** Most recent prior market close, supplied by the configured market-data provider. */
  previousClose?: number;
  /** Trailing annual dividend per unit, supplied by the provider or recorded by the user. */
  annualDividendPerUnit?: number;
  currency: string;
  purchaseDate: Date;
  sector?: string;
  exchange?: string;
  notes?: string;
}

export interface Portfolio {
  investments: Investment[];
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
}

export interface AssetAllocation {
  type: string;
  value: number;
  percentage: number;
  targetPercentage?: number;
}

export interface PerformanceMetrics {
  daily: number;
  weekly: number | null;
  monthly: number | null;
  quarterly: number | null;
  yearly: number;
  allTime: number;
}

export interface InvestmentInsight {
  type: 'rebalance' | 'opportunity' | 'risk' | 'dividend' | 'achievement';
  message: string;
  investmentId?: string;
  severity: 'low' | 'medium' | 'high';
  action?: string;
}

/**
 * Calculate portfolio value and metrics
 */
export function calculatePortfolio(investments: Investment[]): Portfolio {
  const totalValue = investments.reduce((sum, inv) => sum + (inv.quantity * inv.currentPrice), 0);
  const totalCost = investments.reduce((sum, inv) => sum + (inv.quantity * inv.averageCost), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  
  const previousCloseValue = investments.reduce(
    (sum, inv) => sum + inv.quantity * (inv.previousClose ?? inv.currentPrice),
    0,
  );
  const dayChange = totalValue - previousCloseValue;
  const dayChangePercentage = previousCloseValue > 0 ? (dayChange / previousCloseValue) * 100 : 0;
  
  return {
    investments,
    totalValue,
    totalCost,
    totalGainLoss,
    totalGainLossPercentage,
    dayChange,
    dayChangePercentage,
  };
}

/**
 * Calculate asset allocation
 */
export function calculateAssetAllocation(investments: Investment[]): AssetAllocation[] {
  const typeTotals: Record<string, number> = {};
  const totalValue = investments.reduce((sum, inv) => sum + (inv.quantity * inv.currentPrice), 0);
  
  investments.forEach(inv => {
    const value = inv.quantity * inv.currentPrice;
    typeTotals[inv.type] = (typeTotals[inv.type] || 0) + value;
  });
  
  return Object.entries(typeTotals).map(([type, value]) => ({
    type,
    value,
    percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
  })).sort((a, b) => b.value - a.value);
}

/**
 * Calculate sector allocation
 */
export function calculateSectorAllocation(investments: Investment[]): Array<{ sector: string; value: number; percentage: number }> {
  const sectorTotals: Record<string, number> = {};
  const totalValue = investments.reduce((sum, inv) => sum + (inv.quantity * inv.currentPrice), 0);
  
  investments.forEach(inv => {
    if (inv.sector) {
      const value = inv.quantity * inv.currentPrice;
      sectorTotals[inv.sector] = (sectorTotals[inv.sector] || 0) + value;
    }
  });
  
  return Object.entries(sectorTotals).map(([sector, value]) => ({
    sector,
    value,
    percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
  })).sort((a, b) => b.value - a.value);
}

/**
 * Generate investment insights
 */
export function generateInvestmentInsights(investments: Investment[]): InvestmentInsight[] {
  const insights: InvestmentInsight[] = [];
  const portfolio = calculatePortfolio(investments);
  const assetAllocation = calculateAssetAllocation(investments);
  
  // Check for concentration risk (more than 30% in one asset type)
  assetAllocation.forEach(allocation => {
    if (allocation.percentage > 30) {
      insights.push({
        type: 'risk',
        message: `${allocation.type} represents ${allocation.percentage.toFixed(1)}% of your portfolio. Consider diversifying.`,
        severity: 'medium',
        action: 'Consider rebalancing to reduce concentration risk',
      });
    }
  });
  
  // Check for underperforming investments
  investments.forEach(inv => {
    const currentValue = inv.quantity * inv.currentPrice;
    const cost = inv.quantity * inv.averageCost;
    const gainLoss = ((currentValue - cost) / cost) * 100;
    
    if (gainLoss < -20) {
      insights.push({
        type: 'risk',
        message: `${inv.name} (${inv.symbol}) is down ${gainLoss.toFixed(1)}%. Review your position.`,
        investmentId: inv.id,
        severity: 'high',
        action: 'Consider selling or averaging down if you believe in long-term prospects',
      });
    }
    
    if (gainLoss > 50) {
      insights.push({
        type: 'opportunity',
        message: `${inv.name} (${inv.symbol}) is up ${gainLoss.toFixed(1)}%. Consider taking profits.`,
        investmentId: inv.id,
        severity: 'low',
        action: 'Consider selling some shares to lock in gains',
      });
    }
  });
  
  // Check for rebalancing opportunities
  const targetAllocation: Record<string, number> = {
    stock: 60,
    etf: 20,
    bond: 10,
    crypto: 5,
    other: 5,
  };
  
  assetAllocation.forEach(allocation => {
    const target = targetAllocation[allocation.type] || 5;
    const diff = allocation.percentage - target;
    
    if (Math.abs(diff) > 10) {
      insights.push({
        type: 'rebalance',
        message: `${allocation.type} is ${diff > 0 ? 'overweight' : 'underweight'} by ${Math.abs(diff).toFixed(1)}%.`,
        severity: 'low',
        action: diff > 0 ? 'Consider selling some positions' : 'Consider buying more',
      });
    }
  });
  
  // Achievement milestones
  if (portfolio.totalValue > 100000) {
    insights.push({
      type: 'achievement',
      message: 'Congratulations! Your portfolio has exceeded $100,000!',
      severity: 'low',
    });
  }
  
  if (portfolio.totalGainLossPercentage > 50) {
    insights.push({
      type: 'achievement',
      message: `Great job! Your portfolio is up ${portfolio.totalGainLossPercentage.toFixed(1)}% overall!`,
      severity: 'low',
    });
  }
  
  return insights;
}

/**
 * Calculate performance metrics from provider/database portfolio snapshots.
 * Values without a snapshot are deliberately omitted rather than fabricated.
 */
export function calculatePerformanceMetrics(
  investments: Investment[],
  snapshots: Partial<Pick<PerformanceMetrics, 'weekly' | 'monthly' | 'quarterly'>> = {},
): PerformanceMetrics {
  const portfolio = calculatePortfolio(investments);
  return {
    daily: portfolio.dayChangePercentage,
    weekly: snapshots.weekly ?? null,
    monthly: snapshots.monthly ?? null,
    quarterly: snapshots.quarterly ?? null,
    yearly: portfolio.totalGainLossPercentage,
    allTime: portfolio.totalGainLossPercentage,
  };
}

/**
 * Get top performers
 */
export function getTopPerformers(investments: Investment[], limit: number = 5): Investment[] {
  const withPerformance = investments.map(inv => ({
    ...inv,
    performance: ((inv.currentPrice - inv.averageCost) / inv.averageCost) * 100,
  }));
  
  return withPerformance
    .sort((a, b) => b.performance - a.performance)
    .slice(0, limit);
}

/**
 * Get worst performers
 */
export function getWorstPerformers(investments: Investment[], limit: number = 5): Investment[] {
  const withPerformance = investments.map(inv => ({
    ...inv,
    performance: ((inv.currentPrice - inv.averageCost) / inv.averageCost) * 100,
  }));
  
  return withPerformance
    .sort((a, b) => a.performance - b.performance)
    .slice(0, limit);
}

/**
 * Calculate annual dividend income from recorded/provider-supplied dividend data.
 */
export function calculateDividendIncome(investments: Investment[]): number {
  return investments.reduce((sum, inv) => sum + inv.quantity * (inv.annualDividendPerUnit ?? 0), 0);
}

/**
 * Format investment type for display
 */
export function formatInvestmentType(type: Investment['type']): string {
  const typeMap: Record<Investment['type'], string> = {
    stock: 'Stock',
    etf: 'ETF',
    mutual_fund: 'Mutual Fund',
    bond: 'Bond',
    crypto: 'Cryptocurrency',
    real_estate: 'Real Estate',
    other: 'Other',
  };
  
  return typeMap[type] || type;
}

/**
 * Get investment type color
 */
export function getInvestmentTypeColor(type: Investment['type']): string {
  const colorMap: Record<Investment['type'], string> = {
    stock: 'text-blue-500',
    etf: 'text-green-500',
    mutual_fund: 'text-purple-500',
    bond: 'text-yellow-500',
    crypto: 'text-orange-500',
    real_estate: 'text-pink-500',
    other: 'text-gray-500',
  };
  
  return colorMap[type] || 'text-gray-500';
}
