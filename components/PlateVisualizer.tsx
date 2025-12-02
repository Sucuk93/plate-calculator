import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Plate } from '@/lib/iwf';
import { cn } from '@/lib/utils';

interface PlateVisualizerProps {
  plates: Plate[];
  hasCollars: boolean;
}

// Dimensions relative to view
const MAX_HEIGHT = 200; // 450mm diameter reference (Large/Training Plates)
// Scale factors (approximate for visual distinction):
const DIAMETER_SCALE: Record<string, number> = {
  // Standard Large
  '25': 1.0,
  '20': 1.0,
  '15': 1.0,
  '10': 1.0,
  // Training Large (Same diameter as big plates)
  '5-training': 1.0,
  '2.5-training': 1.0,
  // Small / Change
  '5': 0.6,
  '2.5': 0.5,
  '2': 0.45,
  '1.5': 0.4,
  '1': 0.35,
  '0.5': 0.3,
};

// Thickness (Width in pixels) - Just visual approximations
const THICKNESS_SCALE: Record<number, number> = {
  25: 28,
  20: 24,
  15: 20,
  10: 16,
  5: 14,
  2.5: 12,
  2: 10,
  1.5: 9,
  1: 8,
  0.5: 6,
};

export function PlateVisualizer({ plates, hasCollars }: PlateVisualizerProps) {
  // Sort plates:
  // Inner: Large, Training, or Small >= 2.5
  // Outer: Small <= 2

  const innerPlates = plates.filter((p) => p.weight >= 2.5);
  const outerPlates = plates.filter((p) => p.weight <= 2);

  return (
    <View className="w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 py-12 dark:border-gray-800 dark:bg-gray-900">
      {/* The Bar/Sleeve */}
      <View className="relative flex-row items-center">
        {/* Sleeve Background Line */}
        <View className="absolute left-0 right-0 z-0 h-4 rounded-full bg-gray-300 dark:bg-gray-600" />

        {/* Inner Stop (Shoulder) */}
        <View className="z-10 mr-1 h-16 w-6 rounded-sm bg-gray-400 dark:bg-gray-500" />

        {/* Inner Plates */}
        {innerPlates.map((plate, index) => (
          <PlateItem key={`inner-${index}`} plate={plate} />
        ))}

        {/* Collar (Only if hasCollars is true) */}
        {hasCollars && <CollarItem />}

        {/* Outer Plates */}
        {outerPlates.map((plate, index) => (
          <PlateItem key={`outer-${index}`} plate={plate} />
        ))}

        {/* End of sleeve cap (optional, just empty space) */}
        <View className="w-8" />
      </View>

      <View className="mt-6 flex-row flex-wrap justify-center gap-2 px-4">
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          {plates.length === 0
            ? 'Empty Bar'
            : `Loaded: ${plates.map((p) => p.weight + (p.text ? p.text : '')).join(', ')}`}
          {hasCollars && ' + Collars'}
        </Text>
      </View>
    </View>
  );
}

function PlateItem({ plate }: { plate: Plate }) {
  // Determine scale key
  const scaleKey = plate.type === 'training' ? `${plate.weight}-training` : `${plate.weight}`;
  const heightScale = DIAMETER_SCALE[scaleKey] || 0.3; // Fallback to small
  const height = MAX_HEIGHT * heightScale;
  const width = THICKNESS_SCALE[plate.weight] || 10;

  return (
    <View
      className="z-10 mx-[1px] items-center justify-center shadow-sm"
      style={{
        height: height,
        width: width,
        backgroundColor: plate.color,
        borderColor: plate.borderColor || 'rgba(0,0,0,0.1)',
        borderWidth: plate.borderColor ? 2 : 0,
        borderRadius: 2,
      }}>
      {/* Text for Weight or "T" */}
      {/* If training plate ("T"), always show if possible. Or show weight vertically. */}

      <View
        style={{
          transform: [{ rotate: '-90deg' }],
          width: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {plate.text ? (
          <Text className="text-[10px] font-black text-black/50">{plate.text}</Text>
        ) : width > 10 ? (
          <Text className="text-[8px] font-bold text-white/90">{plate.weight}</Text>
        ) : null}
      </View>
    </View>
  );
}

function CollarItem() {
  return (
    <View className="z-10 mx-1 items-center justify-center">
      {/* The main collar body */}
      <View className="relative h-20 w-8 overflow-hidden rounded-sm border-2 border-gray-400 bg-gray-300 shadow-sm dark:bg-zinc-300">
        <View className="absolute bottom-2 left-1 right-1 top-2 border-l-2 border-gray-400/30" />
      </View>
      {/* Screw handle visual */}
      <View className="absolute -top-3 h-4 w-6 rounded-full bg-gray-400" />
    </View>
  );
}
