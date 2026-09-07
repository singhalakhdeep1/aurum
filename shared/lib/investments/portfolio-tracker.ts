/**
 * Investment Portfolio Tracking Service
 * Track stocks, ETFs, mutual funds, and other investments
 *
 * Day-change, performance period metrics, and dividend income are all
 * derived from provider/database data passed in by the caller — this
 * module contains no hardcoded or synthetic values.
 */

export interface Investment {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'etf' | 'mutual_fund' | 'bond' | 'crypto' | 'real_estate' | 'other';
  quantity: number;
  averageCost: number;
  currentPrice: number;
  /**
   * Most recent prior market-close price for this symbol, supplied by the
   * configured market-data provider (e.g. Yahoo Finance, Alpha Vantage, Polygon.io).
   * When absent the day-change figures will be reported as 0 / null.
   */
  previousClose?: number;
  /**
   * Trailing twelve-month dividend per unit expressed in the investment's
   * currency, supplied by the provider or recorded by the user.
   * When absent, this holding contributes 0 to dividend income totals.
   */
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
  /** Absolute day change in the portfolio's native currency. null when previousClose data is unavailable. */
  dayChange: number | null;
  /** Percentage day change. null when previousClose data is unavailable. */
  dayChangePercentage: number | null;
}

export interface AssetAllocation {
  type: string;
  value: number;
  percentage: number;
  targetPercentage?: number;
}

/**
 * Period-over-period performance percentages derived from database snapshots.
 * Periods without a snapshot are null — they are never fabricated.
 */
export interface PerformanceMetrics {
  /** Percentage change from yesterday's close to today. */
  daily: number | null;
  /** Percentage change over the trailing 7 days. null when no snapshot exists. */
  weekly: number | null;
  /** Percentage change over the trailing 30 days. null when no snapshot exists. */
  monthly: number | null;
  /** Percentage change over the trailing 90 days. null when no snapshot exists. */
  quarterly: number | null;
  /** Percentage change over the trailing 365 days. null when no snapshot exists. */
  yearly: number | null;
  /** Percentage change since the earliest recorded cost basis. */
  allTime: number;
}

export interface PerformanceSnapshots {
  /** Portfolio value 7 days ago; used to derive the weekly % change. */
  valueSevenDaysAgo?: number;
  /** Portfolio value 30 days ago. */
  valueThirtyDaysAgo?: number;
  /** Portfolio value 90 days ago. */
  valueNinetyDaysAgo?: number;
  /** Portfolio value 365 days ago. */
  valueOneYearAgo?: number;
}

export interface InvestmentInsight {
  type: 'rebalance' | 'opportunity' | 'risk' | 'dividend' | 'achievement';
  message: string;
  investmentId?: string;
  severity: 'low' | 'medium' | 'high';
  action?: string;
}

// ---------------------------------------------------------------------------
// Core calculations
// ---------------------------------------------------------------------------

/**
 * Calculate portfolio summary metrics from live provider data.
 *
 * @param investments - Array of investments with `currentPrice` and optionally
 *   `previousClose` sourced from the configured market-data provider.
 */
export function calculatePortfolio(investments: Investment[]): Portfolio {
  const totalValue = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.currentPrice,
    0,
  );
  const totalCost = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.averageCost,
    0,
  );
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  // Day-change is only computable when the provider has supplied previousClose
  // for at least one holding. Holdings without previousClose use currentPrice
  // as a stand-in (contributing 0 to the day change for that position).
  const hasPreviousCloseData = investments.some((inv) => inv.previousClose !== undefined);

  let dayChange: number | null = null;
  let dayChangePercentage: number | null = null;

  if (hasPreviousCloseData) {
    const previousCloseValue = investments.reduce(
      (sum, inv) => sum + inv.quantity * (inv.previousClose ?? inv.currentPrice),
      0,
    );
    dayChange = totalValue - previousCloseValue;
    dayChangePercentage =
      previousCloseValue > 0 ? (dayChange / previousCloseValue) * 100 : 0;
  }

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
 * Calculate asset-type allocation as percentages of total portfolio value.
 */
export function calculateAssetAllocation(investments: Investment[]): AssetAllocation[] {
  const typeTotals: Record<string, number> = {};
  const totalValue = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.currentPrice,
    0,
  );

  investments.forEach((inv) => {
    const value = inv.quantity * inv.currentPrice;
    typeTotals[inv.type] = (typeTotals[inv.type] || 0) + value;
  });

  return Object.entries(typeTotals)
    .map(([type, value]) => ({
      type,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Calculate sector allocation from the sector metadata on each investment.
 */
export function calculateSectorAllocation(
  investments: Investment[],
): Array<{ sector: string; value: number; percentage: number }> {
  const sectorTotals: Record<string, number> = {};
  const totalValue = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.currentPrice,
    0,
  );

  investments.forEach((inv) => {
    if (inv.sector) {
      const value = inv.quantity * inv.currentPrice;
      sectorTotals[inv.sector] = (sectorTotals[inv.sector] || 0) + value;
    }
  });

  return Object.entries(sectorTotals)
    .map(([sector, value]) => ({
      sector,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Calculate period performance metrics from provider/database portfolio snapshots.
 *
 * Each period value is derived by comparing the current portfolio value against
 * the portfolio value at that period boundary (supplied by the caller from the
 * database or market-data provider). Periods without a snapshot return null.
 *
 * @param investments - Current holdings with live prices.
 * @param snapshots   - Historical portfolio values from the database.
 */
export function calculatePerformanceMetrics(
  investments: Investment[],
  snapshots: PerformanceSnapshots = {},
): PerformanceMetrics {
  const portfolio = calculatePortfolio(investments);
  const current = portfolio.totalValue;

  function periodChange(snapshotValue?: number): number | null {
    if (snapshotValue === undefined || snapshotValue === null || snapshotValue === 0) {
      return null;
    }
    return ((current - snapshotValue) / snapshotValue) * 100;
  }

  return {
    daily: portfolio.dayChangePercentage,
    weekly: periodChange(snapshots.valueSevenDaysAgo),
    monthly: periodChange(snapshots.valueThirtyDaysAgo),
    quarterly: periodChange(snapshots.valueNinetyDaysAgo),
    yearly: periodChange(snapshots.valueOneYearAgo),
    allTime: portfolio.totalGainLossPercentage,
  };
}

/**
 * Calculate total annual dividend income from provider/user-recorded data.
 *
 * Each investment must supply `annualDividendPerUnit` (trailing 12-month
 * dividend per share/unit in the investment's currency) — e.g. sourced from
 * the market-data provider or entered manually by the user. Holdings without
 * this field contribute 0.
 */
export function calculateDividendIncome(investments: Investment[]): number {
  return investments.reduce(
    (sum, inv) => sum + inv.quantity * (inv.annualDividendPerUnit ?? 0),
    0,
  );
}

// ---------------------------------------------------------------------------
// Ranking helpers
// ---------------------------------------------------------------------------

/**
 * Return the top N performers ranked by gain/loss % against average cost.
 */
export function getTopPerformers(investments: Investment[], limit = 5): Investment[] {
  return [...investments]
    .sort((a, b) => {
      const perfA = ((a.currentPrice - a.averageCost) / a.averageCost) * 100;
      const perfB = ((b.currentPrice - b.averageCost) / b.averageCost) * 100;
      return perfB - perfA;
    })
    .slice(0, limit);
}

/**
 * Return the bottom N performers ranked by gain/loss % against average cost.
 */
export function getWorstPerformers(investments: Investment[], limit = 5): Investment[] {
  return [...investments]
    .sort((a, b) => {
      const perfA = ((a.currentPrice - a.averageCost) / a.averageCost) * 100;
      const perfB = ((b.currentPrice - b.averageCost) / b.averageCost) * 100;
      return perfA - perfB;
    })
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Insights
// ---------------------------------------------------------------------------

/**
 * Generate actionable insights from live portfolio data.
 * No synthetic data is used — all thresholds operate on provider-supplied prices.
 */
export function generateInvestmentInsights(investments: Investment[]): InvestmentInsight[] {
  const insights: InvestmentInsight[] = [];
  const portfolio = calculatePortfolio(investments);
  const assetAllocation = calculateAssetAllocation(investments);

  // Concentration risk: any single asset type > 30% of portfolio
  assetAllocation.forEach((allocation) => {
    if (allocation.percentage > 30) {
      insights.push({
        type: 'risk',
        message: `${allocation.type} represents ${allocation.percentage.toFixed(1)}% of your portfolio. Consider diversifying.`,
        severity: 'medium',
        action: 'Consider rebalancing to reduce concentration risk',
      });
    }
  });

  // Individual holding performance
  investments.forEach((inv) => {
    const currentValue = inv.quantity * inv.currentPrice;
    const cost = inv.quantity * inv.averageCost;
    if (cost === 0) return;
    const gainLoss = ((currentValue - cost) / cost) * 100;

    if (gainLoss < -20) {
      insights.push({
        type: 'risk',
        message: `${inv.name} (${inv.symbol}) is down ${Math.abs(gainLoss).toFixed(1)}%. Review your position.`,
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

    // Dividend income suggestion for non-dividend holdings
    if (
      (inv.type === 'stock' || inv.type === 'etf') &&
      (inv.annualDividendPerUnit === undefined || inv.annualDividendPerUnit === 0)
    ) {
      insights.push({
        type: 'dividend',
        message: `${inv.name} (${inv.symbol}) pays no recorded dividends. Verify with your data provider.`,
        investmentId: inv.id,
        severity: 'low',
        action: 'Update annualDividendPerUnit from your market-data provider for accurate income tracking',
      });
    }
  });

  // Rebalancing: compare actual vs. standard target allocation
  const targetAllocation: Record<string, number> = {
    stock: 60,
    etf: 20,
    bond: 10,
    crypto: 5,
    other: 5,
  };

  assetAllocation.forEach((allocation) => {
    const target = targetAllocation[allocation.type] ?? 5;
    const diff = allocation.percentage - target;

    if (Math.abs(diff) > 10) {
      insights.push({
        type: 'rebalance',
        message: `${allocation.type} is ${diff > 0 ? 'overweight' : 'underweight'} by ${Math.abs(diff).toFixed(1)}% vs. the default target.`,
        severity: 'low',
        action: diff > 0 ? 'Consider selling some positions' : 'Consider buying more',
      });
    }
  });

  // Achievement milestones
  if (portfolio.totalValue > 100_000) {
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

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

/** Human-readable label for an investment type. */
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

  return typeMap[type] ?? type;
}

/** Tailwind colour class for an investment type chip/badge. */
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

  return colorMap[type] ?? 'text-gray-500';
}
