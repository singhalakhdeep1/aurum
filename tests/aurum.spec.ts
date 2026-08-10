import { describe, it, expect } from 'vitest';

describe('Aurum Financial Engine', () => {
  it('should calculate compound interest correctly', () => {
    const principal = 10000;
    const rate = 0.07;
    const years = 5;

    const amount = principal * Math.pow(1 + rate, years);
    expect(amount).toBeCloseTo(14025.52, 2);
  });
});
