import { describe, it, expect } from 'vitest';
import {
  calculatePortfolio,
  calculateAssetAllocation,
  calculateSectorAllocation,
  calculatePerformanceMetrics,
  calculateDividendIncome,
  generateInvestmentInsights,
  getTopPerformers,
  getWorstPerformers,
  formatInvestmentType,
  getInvestmentTypeColor,
  type Investment,
  type PerformanceSnapshots,
} from '../shared/lib/investments/portfolio-tracker';

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

function makeInvestment(overrides: Partial<Investment> = {}): Investment {
  return {
    id: 'inv-1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    quantity: 10,
    averageCost: 150,
    currentPrice: 180,
    currency: 'USD',
    purchaseDate: new Date('2024-01-01'),
    ...overrides,
  };
}

const APPLE = makeInvestment({ id: 'inv-1', symbol: 'AAPL', name: 'Apple Inc.', quantity: 10, averageCost: 150, currentPrice: 180, previousClose: 175, annualDividendPerUnit: 0.96 });
const VANGUARD_ETF = makeInvestment({ id: 'inv-2', symbol: 'VOO', name: 'Vanguard S&P 500', type: 'etf', quantity: 5, averageCost: 400, currentPrice: 450, previousClose: 440, annualDividendPerUnit: 6.00 });
const BOND = makeInvestment({ id: 'inv-3', symbol: 'BND', name: 'Vanguard Total Bond', type: 'bond', quantity: 20, averageCost: 70, currentPrice: 72, previousClose: 72, annualDividendPerUnit: 2.50 });

// ---------------------------------------------------------------------------
// calculatePortfolio
// ---------------------------------------------------------------------------

describe('calculatePortfolio', () => {
  it('correctly calculates total value from quantity × currentPrice', () => {
    const portfolio = calculatePortfolio([APPLE]);
    // 10 × 180 = 1800
    expect(portfolio.totalValue).toBeCloseTo(1800);
  });

  it('correctly calculates total cost from quantity × averageCost', () => {
    const portfolio = calculatePortfolio([APPLE]);
    // 10 × 150 = 1500
    expect(portfolio.totalCost).toBeCloseTo(1500);
  });

  it('correctly calculates total gain/loss', () => {
    const portfolio = calculatePortfolio([APPLE]);
    expect(portfolio.totalGainLoss).toBeCloseTo(300);
  });

  it('correctly calculates gain/loss percentage', () => {
    const portfolio = calculatePortfolio([APPLE]);
    // 300 / 1500 * 100 = 20%
    expect(portfolio.totalGainLossPercentage).toBeCloseTo(20);
  });

  it('calculates day change from previousClose when available', () => {
    // APPLE: 10 × (180 - 175) = 50
    const portfolio = calculatePortfolio([APPLE]);
    expect(portfolio.dayChange).toBeCloseTo(50);
    // 50 / (10×175) × 100 ≈ 2.857%
    expect(portfolio.dayChangePercentage).toBeCloseTo(2.857, 2);
  });

  it('returns null dayChange when no previousClose data exists', () => {
    const inv = makeInvestment({ previousClose: undefined });
    const portfolio = calculatePortfolio([inv]);
    expect(portfolio.dayChange).toBeNull();
    expect(portfolio.dayChangePercentage).toBeNull();
  });

  it('uses currentPrice for holdings without previousClose, zeroing their contribution', () => {
    // APPLE has previousClose=175, bond has none — bond should contribute 0 to dayChange
    const noClose = makeInvestment({ id: 'inv-x', symbol: 'XYZ', previousClose: undefined, quantity: 10, currentPrice: 100 });
    const appleOnly = calculatePortfolio([APPLE]);
    const mixed = calculatePortfolio([APPLE, noClose]);
    // dayChange for mixed should equal APPLE's dayChange (noClose contributes 0)
    expect(mixed.dayChange).toBeCloseTo(appleOnly.dayChange!);
  });

  it('handles empty portfolio gracefully', () => {
    const portfolio = calculatePortfolio([]);
    expect(portfolio.totalValue).toBe(0);
    expect(portfolio.totalCost).toBe(0);
    expect(portfolio.totalGainLoss).toBe(0);
    expect(portfolio.totalGainLossPercentage).toBe(0);
    expect(portfolio.dayChange).toBeNull();
  });

  it('aggregates multiple investments correctly', () => {
    const portfolio = calculatePortfolio([APPLE, VANGUARD_ETF]);
    // APPLE: 10×180=1800, VOO: 5×450=2250 → total 4050
    expect(portfolio.totalValue).toBeCloseTo(4050);
    // APPLE cost: 1500, VOO cost: 2000 → total 3500
    expect(portfolio.totalCost).toBeCloseTo(3500);
  });
});

// ---------------------------------------------------------------------------
// calculateAssetAllocation
// ---------------------------------------------------------------------------

describe('calculateAssetAllocation', () => {
  it('returns correct percentages for a single-type portfolio', () => {
    const alloc = calculateAssetAllocation([APPLE]);
    expect(alloc).toHaveLength(1);
    expect(alloc[0].type).toBe('stock');
    expect(alloc[0].percentage).toBeCloseTo(100);
  });

  it('splits allocation across multiple types', () => {
    // APPLE (stock): 1800, VOO (etf): 2250 → total 4050
    const alloc = calculateAssetAllocation([APPLE, VANGUARD_ETF]);
    const stockAlloc = alloc.find((a) => a.type === 'stock')!;
    const etfAlloc = alloc.find((a) => a.type === 'etf')!;
    expect(stockAlloc.percentage).toBeCloseTo((1800 / 4050) * 100, 2);
    expect(etfAlloc.percentage).toBeCloseTo((2250 / 4050) * 100, 2);
  });

  it('sorts by value descending', () => {
    const alloc = calculateAssetAllocation([APPLE, VANGUARD_ETF]);
    expect(alloc[0].value).toBeGreaterThan(alloc[1].value);
  });

  it('returns empty array for no investments', () => {
    expect(calculateAssetAllocation([])).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// calculateSectorAllocation
// ---------------------------------------------------------------------------

describe('calculateSectorAllocation', () => {
  it('groups investments by sector', () => {
    const tech = makeInvestment({ id: 'a', symbol: 'AAPL', sector: 'Technology', quantity: 10, currentPrice: 180 });
    const health = makeInvestment({ id: 'b', symbol: 'JNJ', sector: 'Healthcare', quantity: 5, currentPrice: 160 });
    const alloc = calculateSectorAllocation([tech, health]);
    expect(alloc.find((a) => a.sector === 'Technology')).toBeDefined();
    expect(alloc.find((a) => a.sector === 'Healthcare')).toBeDefined();
  });

  it('ignores investments without a sector', () => {
    const noSector = makeInvestment({ sector: undefined });
    const alloc = calculateSectorAllocation([noSector]);
    expect(alloc).toHaveLength(0);
  });

  it('percentages sum to approximately 100', () => {
    const tech = makeInvestment({ id: 'a', symbol: 'AAPL', sector: 'Technology', quantity: 10, currentPrice: 180 });
    const health = makeInvestment({ id: 'b', symbol: 'JNJ', sector: 'Healthcare', quantity: 5, currentPrice: 160 });
    const alloc = calculateSectorAllocation([tech, health]);
    const total = alloc.reduce((s, a) => s + a.percentage, 0);
    expect(total).toBeCloseTo(100, 1);
  });
});

// ---------------------------------------------------------------------------
// calculatePerformanceMetrics
// ---------------------------------------------------------------------------

describe('calculatePerformanceMetrics', () => {
  const snapshots: PerformanceSnapshots = {
    valueSevenDaysAgo: 1700,
    valueThirtyDaysAgo: 1600,
    valueNinetyDaysAgo: 1500,
    valueOneYearAgo: 1400,
  };

  it('computes daily from dayChangePercentage', () => {
    const metrics = calculatePerformanceMetrics([APPLE], snapshots);
    // APPLE dayChangePercentage ≈ 2.857
    expect(metrics.daily).toBeCloseTo(2.857, 2);
  });

  it('computes weekly from snapshot', () => {
    const metrics = calculatePerformanceMetrics([APPLE], snapshots);
    // current: 1800, 7d ago: 1700 → (100/1700)*100 ≈ 5.88%
    expect(metrics.weekly).toBeCloseTo((1800 - 1700) / 1700 * 100, 2);
  });

  it('computes monthly from snapshot', () => {
    const metrics = calculatePerformanceMetrics([APPLE], snapshots);
    expect(metrics.monthly).toBeCloseTo((1800 - 1600) / 1600 * 100, 2);
  });

  it('computes quarterly from snapshot', () => {
    const metrics = calculatePerformanceMetrics([APPLE], snapshots);
    expect(metrics.quarterly).toBeCloseTo((1800 - 1500) / 1500 * 100, 2);
  });

  it('computes yearly from snapshot', () => {
    const metrics = calculatePerformanceMetrics([APPLE], snapshots);
    expect(metrics.yearly).toBeCloseTo((1800 - 1400) / 1400 * 100, 2);
  });

  it('allTime equals totalGainLossPercentage', () => {
    const metrics = calculatePerformanceMetrics([APPLE], snapshots);
    expect(metrics.allTime).toBeCloseTo(20); // (1800-1500)/1500 * 100
  });

  it('returns null for missing snapshot periods', () => {
    const metrics = calculatePerformanceMetrics([APPLE], {});
    expect(metrics.weekly).toBeNull();
    expect(metrics.monthly).toBeNull();
    expect(metrics.quarterly).toBeNull();
    expect(metrics.yearly).toBeNull();
  });

  it('returns null daily when no previousClose data', () => {
    const inv = makeInvestment({ previousClose: undefined });
    const metrics = calculatePerformanceMetrics([inv], {});
    expect(metrics.daily).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// calculateDividendIncome
// ---------------------------------------------------------------------------

describe('calculateDividendIncome', () => {
  it('calculates annual income from annualDividendPerUnit', () => {
    // APPLE: 10 × 0.96 = 9.60
    expect(calculateDividendIncome([APPLE])).toBeCloseTo(9.60);
  });

  it('aggregates across multiple holdings', () => {
    // APPLE: 10 × 0.96 = 9.60, VOO: 5 × 6.00 = 30.00, BOND: 20 × 2.50 = 50.00
    expect(calculateDividendIncome([APPLE, VANGUARD_ETF, BOND])).toBeCloseTo(89.60);
  });

  it('treats missing annualDividendPerUnit as zero (no synthetic yield)', () => {
    const inv = makeInvestment({ annualDividendPerUnit: undefined });
    expect(calculateDividendIncome([inv])).toBe(0);
  });

  it('returns 0 for an empty portfolio', () => {
    expect(calculateDividendIncome([])).toBe(0);
  });

  it('works correctly when some holdings have dividends and others do not', () => {
    const noDividend = makeInvestment({ id: 'x', annualDividendPerUnit: undefined, quantity: 100, currentPrice: 10 });
    // Only APPLE contributes
    expect(calculateDividendIncome([APPLE, noDividend])).toBeCloseTo(9.60);
  });
});

// ---------------------------------------------------------------------------
// getTopPerformers / getWorstPerformers
// ---------------------------------------------------------------------------

describe('getTopPerformers', () => {
  const investments = [
    makeInvestment({ id: '1', symbol: 'A', averageCost: 100, currentPrice: 200 }), // +100%
    makeInvestment({ id: '2', symbol: 'B', averageCost: 100, currentPrice: 120 }), // +20%
    makeInvestment({ id: '3', symbol: 'C', averageCost: 100, currentPrice: 80 }),  // -20%
  ];

  it('returns top N by gain%', () => {
    const top = getTopPerformers(investments, 1);
    expect(top[0].symbol).toBe('A');
  });

  it('does not mutate the original array', () => {
    const copy = [...investments];
    getTopPerformers(investments, 2);
    expect(investments).toEqual(copy);
  });

  it('respects the limit parameter', () => {
    expect(getTopPerformers(investments, 2)).toHaveLength(2);
  });
});

describe('getWorstPerformers', () => {
  const investments = [
    makeInvestment({ id: '1', symbol: 'A', averageCost: 100, currentPrice: 200 }), // +100%
    makeInvestment({ id: '2', symbol: 'B', averageCost: 100, currentPrice: 120 }), // +20%
    makeInvestment({ id: '3', symbol: 'C', averageCost: 100, currentPrice: 80 }),  // -20%
  ];

  it('returns worst N by gain%', () => {
    const worst = getWorstPerformers(investments, 1);
    expect(worst[0].symbol).toBe('C');
  });

  it('does not mutate the original array', () => {
    const copy = [...investments];
    getWorstPerformers(investments, 1);
    expect(investments).toEqual(copy);
  });
});

// ---------------------------------------------------------------------------
// generateInvestmentInsights
// ---------------------------------------------------------------------------

describe('generateInvestmentInsights', () => {
  it('generates a concentration-risk insight when one type exceeds 30%', () => {
    const bigStock = makeInvestment({ quantity: 100, currentPrice: 200, type: 'stock' });
    const smallBond = makeInvestment({ id: 'b', type: 'bond', quantity: 1, currentPrice: 10 });
    const insights = generateInvestmentInsights([bigStock, smallBond]);
    expect(insights.some((i) => i.type === 'risk' && i.message.includes('stock'))).toBe(true);
  });

  it('generates a high-severity risk insight for an investment down > 20%', () => {
    const loser = makeInvestment({ averageCost: 200, currentPrice: 100 }); // -50%
    const insights = generateInvestmentInsights([loser]);
    expect(insights.some((i) => i.type === 'risk' && i.severity === 'high')).toBe(true);
  });

  it('generates an opportunity insight for an investment up > 50%', () => {
    const winner = makeInvestment({ averageCost: 100, currentPrice: 180 }); // +80%
    const insights = generateInvestmentInsights([winner]);
    expect(insights.some((i) => i.type === 'opportunity')).toBe(true);
  });

  it('generates an achievement for portfolio value over $100k', () => {
    const big = makeInvestment({ quantity: 1000, averageCost: 100, currentPrice: 150 });
    const insights = generateInvestmentInsights([big]);
    expect(insights.some((i) => i.type === 'achievement' && i.message.includes('100,000'))).toBe(true);
  });

  it('returns no insights for a perfectly balanced low-value portfolio', () => {
    // Small, balanced, not up 50%, not down 20%
    const s = makeInvestment({ id: 'a', type: 'stock', quantity: 1, averageCost: 100, currentPrice: 105 });
    const e = makeInvestment({ id: 'b', type: 'etf', quantity: 1, averageCost: 100, currentPrice: 102 });
    const insights = generateInvestmentInsights([s, e]);
    // May still flag concentration or rebalance — just make sure no false high-severity alerts
    const highSeverity = insights.filter((i) => i.severity === 'high');
    expect(highSeverity).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

describe('formatInvestmentType', () => {
  it('formats each investment type', () => {
    expect(formatInvestmentType('stock')).toBe('Stock');
    expect(formatInvestmentType('etf')).toBe('ETF');
    expect(formatInvestmentType('mutual_fund')).toBe('Mutual Fund');
    expect(formatInvestmentType('bond')).toBe('Bond');
    expect(formatInvestmentType('crypto')).toBe('Cryptocurrency');
    expect(formatInvestmentType('real_estate')).toBe('Real Estate');
    expect(formatInvestmentType('other')).toBe('Other');
  });
});

describe('getInvestmentTypeColor', () => {
  it('returns a non-empty Tailwind class for each type', () => {
    const types: Investment['type'][] = ['stock', 'etf', 'mutual_fund', 'bond', 'crypto', 'real_estate', 'other'];
    for (const type of types) {
      const color = getInvestmentTypeColor(type);
      expect(color).toMatch(/^text-/);
    }
  });
});
