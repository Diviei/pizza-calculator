import { describe, expect, it } from 'vitest';
import { calculateDough, calculateSimpleDough, DEFAULTS, type DoughInputs, type YeastType } from './calculator.ts';

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
      tempFridge: 4,
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
      ballWeight: 250,
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
      yeastType: 'Fresh',
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
      yeastType: 'Fresh',
    };

    const dryInputs: DoughInputs = {
      ...freshInputs,
      yeastType: 'Instant Dry',
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
      hoursFridge: 0,
    };

    const res = calculateDough(inputs);
    expect(res.yeastPercentage).toBe(0);
    expect(res.yeastGrams).toBe(0);
  });
});

describe('Calculator Engine - Simple Mode Helper', () => {
  it('allocates 100% room temp time when hoursTotal <= 8', () => {
    const res = calculateSimpleDough(4, 6);
    expect(res.hoursRt).toBe(6);
    expect(res.hoursFridge).toBe(0);
    expect(res.totalDoughWeight).toBe(4 * 280);
    expect(res.yeastGrams).toBeGreaterThan(0);
  });

  it('allocates 4h room temp and remaining time in fridge when hoursTotal > 8 and hasFridge is true', () => {
    const res = calculateSimpleDough(4, 24);
    expect(res.hoursRt).toBe(4);
    expect(res.hoursFridge).toBe(20);
    expect(res.totalDoughWeight).toBe(4 * 280);
    expect(res.yeastGrams).toBeGreaterThan(0);
  });

  it('allocates 100% room temp time when hasFridge is false regardless of total hours', () => {
    const res = calculateSimpleDough(4, 24, 'Fresh', 22, 4, 'neapolitan', false);
    expect(res.hoursRt).toBe(24);
    expect(res.hoursFridge).toBe(0);
    expect(res.totalDoughWeight).toBe(4 * 280);
  });

  it('supports custom yeastType and temperatures in Simple Mode', () => {
    const freshRes = calculateSimpleDough(4, 24, 'Fresh', 24, 4);
    const dryRes = calculateSimpleDough(4, 24, 'Instant Dry', 24, 4);

    expect(dryRes.yeastGrams).toBeCloseTo(freshRes.yeastGrams / 3, 3);
  });

  it('calculates dough for Tonda Romana style with 180g balls and 57% hydration', () => {
    const res = calculateSimpleDough(4, 8, 'Fresh', 22, 4, 'tonda_romana');
    expect(res.ballWeight).toBe(180);
    expect(res.totalDoughWeight).toBe(4 * 180);
    // Flour = 720 / (1 + 0.57 + 0.025) = 720 / 1.595 = 451.41
    expect(res.flourGrams).toBeCloseTo(451.41, 1);
    // Water = 451.41 * 0.57 = 257.30
    expect(res.waterGrams).toBeCloseTo(257.3, 1);
  });

  it('handles empty or zero fallback values gracefully', () => {
    const res = calculateDough({
      numberOfBalls: 0,
      ballWeight: 0,
      hydrationPercentage: undefined as unknown as number,
      saltPercentage: undefined as unknown as number,
      yeastType: '' as unknown as YeastType,
      hoursRt: -5,
      tempRt: undefined as unknown as number,
      hoursFridge: -10,
      tempFridge: undefined as unknown as number,
    });

    expect(res.totalDoughWeight).toBe(280);
    expect(res.flourGrams).toBeGreaterThan(0);

    const simpleRes = calculateSimpleDough(0, 0);
    expect(simpleRes.totalDoughWeight).toBe(280);
  });
});
