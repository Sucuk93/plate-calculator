import React from 'react';
import { View, Text } from 'react-native';
import { Plate } from '@/lib/iwf';
import { cn } from '@/lib/utils';
import { VISUALIZER_CONFIG } from '@/lib/visualizer-config';

interface PlateVisualizerProps {
  plates: Plate[];
  hasCollars: boolean;
  barWeight?: number;
}

export function PlateVisualizer({ plates, hasCollars, barWeight }: PlateVisualizerProps) {
  // Sort plates:
  // Inner: Large, Training, or Small >= 2.5
  // Outer: Small <= 2

  const innerPlates = plates.filter((p) => p.weight >= 2.5);
  const outerPlates = plates.filter((p) => p.weight <= 2);

  const totalWeight =
    (barWeight || 0) + plates.reduce((sum, p) => sum + p.weight, 0) * 2 + (hasCollars ? 5 : 0);

  return (
    <View className="w-full flex-1">
      <View className="relative mt-24 min-h-[300px] w-full flex-1 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        {/* Top Left: Total Weight */}
        <View className="absolute left-6 top-6 z-30">
          <Text className="text-7xl font-black leading-none text-gray-900 dark:text-white">
            {totalWeight}
            <Text className="text-3xl text-gray-400 dark:text-gray-500">kg</Text>
          </Text>
        </View>

        {/* Top Right: Bar Type */}
        <View className="absolute right-6 top-6 z-30">
          {barWeight && (
            <Text className="text-right text-3xl font-black uppercase tracking-widest text-gray-900 dark:text-white">
              {barWeight === 20 ? 'Männerhantel\n(20kg)' : 'Frauenhantel\n(15kg)'}
            </Text>
          )}
        </View>

        {/* The Bar/Sleeve */}
        <View className="mt-12 flex-row items-center justify-center">
          {/* Bar Shaft (Left side) - Represents the handle */}
          <View
            className="relative items-center justify-center bg-gray-300 dark:bg-zinc-500"
            style={{
              width: VISUALIZER_CONFIG.bar.shaftWidth,
              height: VISUALIZER_CONFIG.bar.shaftHeight,
            }}>
            {/* Knurling visual effect */}
            <View className="absolute inset-y-0 right-0 w-full bg-black opacity-10" />
            {barWeight && (
              <Text className="text-[16px] font-black uppercase tracking-tighter text-black/60 dark:text-white/60">
                {barWeight}kg
              </Text>
            )}
          </View>

          {/* Inner Stop (Shoulder) */}
          <View
            className="z-20 rounded-sm border-l border-white/10 bg-gray-400 shadow-sm dark:bg-gray-500"
            style={{
              width: VISUALIZER_CONFIG.bar.shoulderWidth,
              height: VISUALIZER_CONFIG.bar.shoulderHeight,
            }}
          />

          {/* The Sleeve & Plates Area */}
          <View className="relative flex-row items-center">
            {/* Sleeve Background Line */}
            <View
              className="absolute left-0 right-[-50px] z-0 rounded-r-full bg-gray-300 dark:bg-gray-600"
              style={{ height: VISUALIZER_CONFIG.bar.sleeveHeight }}
            />

            {/* Small spacer between shoulder and first plate */}
            <View style={{ width: VISUALIZER_CONFIG.innerSpacer }} />

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
        </View>
        {/* Bottom Center: Weight List */}
        <View className="absolute bottom-0 left-0 mb-12 w-full px-4">
          <Text className="text-center text-4xl font-black leading-tight text-gray-900 dark:text-white">
            {plates.length === 0
              ? 'Leere Hantel'
              : [
                  ...innerPlates.map((p) => p.weight + (p.text ? p.text : '') + 'kg'),
                  ...(hasCollars ? ['Verschlüsse'] : []),
                  ...outerPlates.map((p) => p.weight + (p.text ? p.text : '') + 'kg'),
                ].join(', ')}
          </Text>
        </View>
      </View>
    </View>
  );
}

function PlateItem({ plate }: { plate: Plate }) {
  // Determine scale key
  const scaleKey = plate.type === 'training' ? `${plate.weight}-training` : `${plate.weight}`;
  const heightScale = VISUALIZER_CONFIG.diameter[scaleKey] || 0.3; // Fallback to small
  const height = VISUALIZER_CONFIG.maxPlateHeight * heightScale;
  const width = VISUALIZER_CONFIG.thickness[plate.weight] || 10;

  // Use black text for yellow (#F2C94C) and white (#F8F9FA) plates
  const isLightPlate = plate.color === '#F2C94C' || plate.color === '#F8F9FA';
  const textColorClass = isLightPlate ? 'text-black' : 'text-white';

  return (
    <View
      className="z-10 items-center justify-center shadow-sm"
      style={{
        height: height,
        width: width,
        marginHorizontal: VISUALIZER_CONFIG.plateGap,
        backgroundColor: plate.color,
        borderColor: plate.borderColor || 'rgba(0,0,0,0.1)',
        borderWidth: plate.borderColor ? 2 : 0,
        borderRadius: 2,
      }}>
      {plate.text ? (
        <Text className={cn('text-xl font-black opacity-90', textColorClass)}>{plate.text}</Text>
      ) : width > 12 ? (
        <Text
          style={{ fontSize: width > 20 ? 24 : 14 }}
          className={cn('font-black', textColorClass)}>
          {plate.weight}
        </Text>
      ) : null}
    </View>
  );
}

function CollarItem() {
  return (
    <View
      className="z-10 items-center justify-center"
      style={{ marginHorizontal: VISUALIZER_CONFIG.plateGap }}>
      {/* The main collar body */}
      <View
        className="relative overflow-hidden rounded-sm border-2 border-gray-400 bg-gray-300 shadow-sm dark:bg-zinc-300"
        style={{
          width: VISUALIZER_CONFIG.bar.collarWidth,
          height: VISUALIZER_CONFIG.bar.collarHeight,
        }}>
        <View className="absolute bottom-2 left-1 right-1 top-2 border-l-2 border-gray-400/30" />
      </View>
      {/* Screw handle visual */}
      <View className="absolute -top-3 h-4 w-6 rounded-full bg-gray-400" />
    </View>
  );
}
