export type PlateType = 'large' | 'small' | 'training';

export interface Plate {
  weight: number;
  color: string;
  borderColor?: string;
  type: PlateType;
  count: number; // Per side
  text?: string; // "T" for training
}

export interface CalculationResult {
  plates: Plate[];
  hasCollars: boolean;
  remainder: number;
  isValid: boolean;
  error?: string;
}

// Standard Competition Plates (Large, Inside)
const LARGE_PLATES = [
  { weight: 25, color: '#D93F2C' },   // Red
  { weight: 20, color: '#005BD4' },   // Blue
  { weight: 15, color: '#F2C94C' },   // Yellow
  { weight: 10, color: '#27AE60' },   // Green
];

// Training Plates (Large, Inside, Max 1)
const TRAINING_PLATES = [
  { weight: 5, color: '#F8F9FA', borderColor: '#000000', text: 'T' }, // White
  { weight: 2.5, color: '#D93F2C', text: 'T' }, // Red
];

// Small Plates (Can be Inside or Outside depending on weight)
// Includes 5 and 2.5 small versions for when Training plates are exhausted or not used.
const SMALL_PLATES = [
  { weight: 5, color: '#F8F9FA', borderColor: '#000000' },
  { weight: 2.5, color: '#D93F2C' },
  { weight: 2, color: '#005BD4' },
  { weight: 1.5, color: '#F2C94C' },
  { weight: 1, color: '#27AE60' },
  { weight: 0.5, color: '#F8F9FA', borderColor: '#000000' },
];

export const BAR_WEIGHTS = {
  MEN: 20,
  WOMEN: 15,
};

export const MAX_WEIGHTS = {
  MEN: 300,
  WOMEN: 225,
};

export const COLLAR_WEIGHT_PER_SIDE = 2.5; // 5kg total

export function calculatePlates(targetWeight: number, barType: 'MEN' | 'WOMEN'): CalculationResult {
  const barWeight = barType === 'MEN' ? BAR_WEIGHTS.MEN : BAR_WEIGHTS.WOMEN;
  const maxWeight = barType === 'MEN' ? MAX_WEIGHTS.MEN : MAX_WEIGHTS.WOMEN;
  
  // Rule 0: Max Weight Check
  if (targetWeight > maxWeight) {
    return {
      plates: [],
      hasCollars: false,
      remainder: 0,
      isValid: false,
      error: `Maximum weight is ${maxWeight}kg`
    };
  }
  
  // Rule 1: Collar Thresholds
  const useCollars = barType === 'MEN' ? targetWeight >= 30 : targetWeight >= 25;
  const collarWeightTotal = useCollars ? (COLLAR_WEIGHT_PER_SIDE * 2) : 0;

  const minWeight = barWeight; 
  
  if (targetWeight < minWeight) {
    return {
      plates: [],
      hasCollars: false,
      remainder: 0,
      isValid: false,
      error: `Minimum weight is ${minWeight}kg`
    };
  }

  let remainingWeight = targetWeight - barWeight - collarWeightTotal;
  let oneSideWeight = remainingWeight / 2;
  
  // Correction for floating point issues
  oneSideWeight = Math.round(oneSideWeight * 100) / 100;

  if (oneSideWeight < 0) {
      return {
      plates: [],
      hasCollars: useCollars,
      remainder: 0,
      isValid: false,
      error: `Weight too low for configuration`
    };
  }

  const resultPlates: Plate[] = [];

  // Rule 2: Training Plate Thresholds
  // Standard Mode: >= 45kg (Men) or >= 40kg (Women) -> Use Standard Large Plates (down to 10kg)
  // Training Mode: < 45kg (Men) or < 40kg (Women) -> Use Max 1 Training Plate (5 or 2.5), then Small Plates
  const trainingThreshold = barType === 'MEN' ? 45 : 40;
  const useTrainingPlates = targetWeight < trainingThreshold;

  if (!useTrainingPlates) {
    // --- STANDARD MODE ---
    // 1. Fill Large Plates (25, 20, 15, 10)
    for (const p of LARGE_PLATES) {
      while (oneSideWeight >= p.weight) {
        resultPlates.push({ ...p, type: 'large', count: 1 });
        oneSideWeight -= p.weight;
        oneSideWeight = Math.round(oneSideWeight * 100) / 100;
      }
    }
    // 2. Fill Remainder with Small Plates (5, 2.5, 2, 1.5, 1, 0.5)
    for (const p of SMALL_PLATES) {
        while (oneSideWeight >= p.weight) {
            resultPlates.push({ ...p, type: 'small', count: 1 });
            oneSideWeight -= p.weight;
            oneSideWeight = Math.round(oneSideWeight * 100) / 100;
        }
    }

  } else {
    // --- TRAINING MODE ---
    // 1. Try to use ONE Training Plate (5 or 2.5) if possible
    let usedTrainingPlate = false;
    
    for (const p of TRAINING_PLATES) {
        if (!usedTrainingPlate && oneSideWeight >= p.weight) {
            resultPlates.push({ ...p, type: 'training', count: 1 });
            oneSideWeight -= p.weight;
            oneSideWeight = Math.round(oneSideWeight * 100) / 100;
            usedTrainingPlate = true;
            // Break because we only use ONE training plate max
            break; 
        }
    }

    // 2. Fill Remainder with Small Plates (5, 2.5, 2, 1.5, 1, 0.5)
    // This handles cases where we need more weight (e.g. 40kg Men -> Need 7.5 side -> 5 Tr + 2.5 Sm)
    // Or if we didn't use a training plate (e.g. 22kg Men -> Need 1 side -> 1 Sm)
    for (const p of SMALL_PLATES) {
        while (oneSideWeight >= p.weight) {
            resultPlates.push({ ...p, type: 'small', count: 1 });
            oneSideWeight -= p.weight;
            oneSideWeight = Math.round(oneSideWeight * 100) / 100;
        }
    }
  }

  return {
    plates: resultPlates,
    hasCollars: useCollars,
    remainder: oneSideWeight * 2,
    isValid: oneSideWeight === 0,
  };
}
