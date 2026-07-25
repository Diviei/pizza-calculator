/**
 * Pure Calculation Engine for Pizza Dough Calculator
 * Baker's Percentages + Mixed Fermentation Kinetic Model (Room Temperature + Fridge)
 */

export type YeastType = 'Fresh' | 'Instant Dry';

export interface DoughInputs {
  numberOfBalls: number;
  ballWeight: number;
  hydrationPercentage: number;
  saltPercentage: number;
  yeastType: YeastType;
  hoursRt: number;
  tempRt: number;
  hoursFridge: number;
  tempFridge: number;
}

export interface CalculationResults {
  totalDoughWeight: number;
  flourGrams: number;
  waterGrams: number;
  saltGrams: number;
  yeastGrams: number;
  yeastPercentage: number;
}

export const DEFAULTS: DoughInputs = {
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

/**
 * Calculate dough ingredient breakdown and yeast percentage
 */
export function calculateDough(inputs: DoughInputs): CalculationResults {
  const numberOfBalls = Math.max(1, inputs.numberOfBalls || 1);
  const ballWeight = Math.max(10, inputs.ballWeight || 280);
  const hydrationPercentage = inputs.hydrationPercentage ?? 65;
  const saltPercentage = inputs.saltPercentage ?? 2.5;
  const yeastType = inputs.yeastType || 'Fresh';
  const hoursRt = Math.max(0, inputs.hoursRt ?? 0);
  const tempRt = inputs.tempRt ?? 22;
  const hoursFridge = Math.max(0, inputs.hoursFridge ?? 0);
  const tempFridge = inputs.tempFridge ?? 4;

  // Step 1: Base Flour Calculation (Baker's Percentage)
  const totalDoughWeight = numberOfBalls * ballWeight;
  const flourGrams = totalDoughWeight / (1 + hydrationPercentage / 100 + saltPercentage / 100);

  // Step 2: Water & Salt Calculation
  const waterGrams = flourGrams * (hydrationPercentage / 100);
  const saltGrams = flourGrams * (saltPercentage / 100);

  // Step 3: Mixed Yeast Algorithm (Accumulated Kinetic Model)
  const afRt = Math.max(0, tempRt - 3.5);
  const afFridge = Math.max(0, tempFridge - 3.5);

  const contributionRt = hoursRt * afRt ** 2;
  const contributionFridge = hoursFridge * afFridge ** 2;
  const totalFermentationCapacity = contributionRt + contributionFridge;

  let yeastGrams = 0;
  let yeastPercentage = 0;

  if (totalFermentationCapacity > 0) {
    const freshYeastPercentage = 850 / totalFermentationCapacity;

    if (yeastType === 'Instant Dry') {
      yeastPercentage = freshYeastPercentage / 3;
    } else {
      yeastPercentage = freshYeastPercentage;
    }

    yeastGrams = flourGrams * (yeastPercentage / 100);
  }

  return {
    totalDoughWeight,
    flourGrams,
    waterGrams,
    saltGrams,
    yeastGrams,
    yeastPercentage,
  };
}

export interface SimpleDoughInputs {
  numberOfBalls: number;
  hoursTotal: number;
  yeastType?: YeastType;
  tempRt?: number;
  tempFridge?: number;
}

/**
 * Calculate dough for Simple Mode with Neapolitan base defaults:
 * Ball weight: 280g, Hydration: 65%, Salt: 2.5%
 * Configurable: yeastType, tempRt, tempFridge
 * Smart fermentation allocation:
 * - <= 8 hours: 100% Room Temp
 * - > 8 hours: 4h Room Temp + (hours - 4) Fridge
 */
export function calculateSimpleDough(
  numberOfBalls: number,
  hoursTotal: number,
  yeastType: YeastType = 'Fresh',
  tempRt: number = 22,
  tempFridge: number = 4,
): CalculationResults & { hoursRt: number; hoursFridge: number } {
  const safeBalls = Math.max(1, numberOfBalls || 1);
  const safeHours = Math.max(0, hoursTotal || 0);

  const hoursRt = safeHours <= 8 ? safeHours : 4;
  const hoursFridge = safeHours <= 8 ? 0 : safeHours - 4;

  const results = calculateDough({
    numberOfBalls: safeBalls,
    ballWeight: 280,
    hydrationPercentage: 65,
    saltPercentage: 2.5,
    yeastType,
    hoursRt,
    tempRt,
    hoursFridge,
    tempFridge,
  });

  return {
    ...results,
    hoursRt,
    hoursFridge,
  };
}
