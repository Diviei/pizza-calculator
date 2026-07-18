import { describe, it, expect } from 'vitest';
import { calculateDough, DoughInputs, DEFAULTS } from './calculator.ts';

describe('Calculator Engine - Baker Percentages', () => {
  it('calculates exact flour, water, and salt for 1 ball of 280g at 65% hydration and 2.5% salt', () => {
    const inputs: DoughInputs = {
      numberOfBalls: 1,
      ballWeight: 280,
      hydrationPercentage: 65,
      saltPercentage: 2.5,
      yeastType: 'Fresh',
      hoursRt: 4,
      tempRt: 22,
      hoursFridge: 0,
      tempFridge: 4
    };

    const res = calculateDough(inputs);

    expect(res.totalDoughWeight).toBe(280);
    // Flour = 280 / (1 + 0.65 + 0.025) = 280 / 1.675 = 167.164...
    expect(res.flourGrams).toBeCloseTo(167.16, 1);
    // Water = 167.16 * 0.65 = 108.65...
    expect(res.waterGrams).toBeCloseTo(108.65, 1);
    // Salt = 167.16 * 0.025 = 4.18...
    expect(res.saltGrams).toBeCloseTo(4.18, 1);
  });

  it('scales total dough weight linearly with multiple balls', () => {
    const inputs: DoughInputs = {
      ...DEFAULTS,
      numberOfBalls: 4,
      ballWeight: 250
    };

    const res = calculateDough(inputs);
    expect(res.totalDoughWeight).toBe(1000);
  });
});

describe('Calculator Engine - Mixed Fermentation Yeast Model', () => {
  it('calculates fresh yeast percentage using kinetic accumulation formula', () => {
    const inputs: DoughInputs = {
      ...DEFAULTS,
      hoursRt: 4,
      tempRt: 22,
      hoursFridge: 0,
      tempFridge: 4,
      yeastType: 'Fresh'
    };

    const res = calculateDough(inputs);
    // AF_RT = (22 - 3.5)^2 = (18.5)^2 = 342.25
    // Capacity = 4 * 342.25 = 1369
    // Fresh Yeast % = 850 / 1369 = ~0.6209%
    expect(res.yeastPercentage).toBeCloseTo(0.62, 2);
    expect(res.yeastGrams).toBeGreaterThan(0);
  });

  it('applies 3:1 ratio for Instant Dry Yeast vs Fresh Yeast', () => {
    const freshInputs: DoughInputs = {
      ...DEFAULTS,
      hoursRt: 8,
      tempRt: 20,
      hoursFridge: 24,
      tempFridge: 4,
      yeastType: 'Fresh'
    };

    const dryInputs: DoughInputs = {
      ...freshInputs,
      yeastType: 'Instant Dry'
    };

    const freshRes = calculateDough(freshInputs);
    const dryRes = calculateDough(dryInputs);

    expect(dryRes.yeastPercentage).toBeCloseTo(freshRes.yeastPercentage / 3, 4);
    expect(dryRes.yeastGrams).toBeCloseTo(freshRes.yeastGrams / 3, 4);
  });

  it('returns 0 yeast when total fermentation time is 0', () => {
    const inputs: DoughInputs = {
      ...DEFAULTS,
      hoursRt: 0,
      hoursFridge: 0
    };

    const res = calculateDough(inputs);
    expect(res.yeastPercentage).toBe(0);
    expect(res.yeastGrams).toBe(0);
  });
});
