import React from 'react';
import { View, Text } from 'react-native';
import { Plate } from '@/lib/iwf';
import { cn } from '@/lib/utils';
import { VISUALIZER_CONFIG } from '@/lib/visualizer-config';

interface PlateVisualizerProps {
  plates: Plate[];
  hasCollars: boolean;
  barWeight?: number;
  customScale?: number;
  showPlateList?: boolean;
}

export function PlateVisualizer({
  plates,
  hasCollars,
  barWeight,
  customScale = 1.0,
  showPlateList = true,
}: PlateVisualizerProps) {
  // Sort plates:
  // Inner: Large, Training, or Small >= 2.5
  // Outer: Small <= 2

  const innerPlates = plates.filter((p) => p.weight >= 2.5);
  const outerPlates = plates.filter((p) => p.weight <= 2);

  const totalWeight =
    (barWeight || 0) + plates.reduce((sum, p) => sum + p.weight, 0) * 2 + (hasCollars ? 5 : 0);

  return (
    <View className="w-full flex-1">
      <View className="relative mt-16 min-h-[300px] w-full flex-1 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 pb-12 dark:border-gray-800 dark:bg-gray-900">
        {/* Top Left: Total Weight */}
        {showPlateList && (
          <View className="absolute left-6 top-6 z-30">
            <Text className="text-9xl font-black leading-none text-gray-900 dark:text-white">
              {totalWeight}
              <Text className="text-3xl text-gray-400 dark:text-gray-500">kg</Text>
            </Text>
          </View>
        )}

        {/* Top Left: Total Weight */}
        {showPlateList && (
          <View className="absolute right-6 top-6 z-30">
            {barWeight && (
              <Text className="text-right text-8xl font-black text-gray-900 dark:text-white">
                {barWeight === 20 ? 'Männerhantel\n(20kg)' : 'Frauenhantel\n(15kg)'}
              </Text>
            )}
          </View>
        )}

        {/* The Bar/Sleeve */}
        <View className="mt-12 flex-row items-center justify-center">
          {/* Bar Shaft (Left side) - Represents the handle */}
          <View
            className="relative items-center justify-center bg-gray-300 dark:bg-zinc-500"
            style={{
              width: VISUALIZER_CONFIG.bar.shaftWidth * customScale,
              height: VISUALIZER_CONFIG.bar.shaftHeight * customScale,
            }}>
            {/* Knurling visual effect */}
            <View className="absolute inset-y-0 right-0 w-full bg-black opacity-10" />
            {barWeight && (
              <Text
                style={{ fontSize: 16 * customScale }}
                className="font-black uppercase tracking-tighter text-black/60 dark:text-white/60">
                {barWeight}kg
              </Text>
            )}
          </View>

          {/* Inner Stop (Shoulder) */}
          <View
            className="z-20 rounded-sm border-l border-white/10 bg-gray-400 shadow-sm dark:bg-gray-500"
            style={{
              width: VISUALIZER_CONFIG.bar.shoulderWidth * customScale,
              height: VISUALIZER_CONFIG.bar.shoulderHeight * customScale,
            }}
          />

          {/* The Sleeve & Plates Area */}
          <View className="relative flex-row items-center">
            {/* Sleeve Background Line */}
            <View
              className="absolute left-0 right-[-50px] z-0 rounded-r-full bg-gray-300 dark:bg-gray-600"
              style={{ height: VISUALIZER_CONFIG.bar.sleeveHeight * customScale }}
            />

            {/* Small spacer between shoulder and first plate */}
            <View style={{ width: VISUALIZER_CONFIG.innerSpacer * customScale }} />

            {/* Inner Plates */}
            {innerPlates.map((plate, index) => (
              <PlateItem key={`inner-${index}`} plate={plate} customScale={customScale} />
            ))}

            {/* Collar (Only if hasCollars is true) */}
            {hasCollars && <CollarItem customScale={customScale} />}

            {/* Outer Plates */}
            {outerPlates.map((plate, index) => (
              <PlateItem key={`outer-${index}`} plate={plate} customScale={customScale} />
            ))}

            {/* End of sleeve cap (optional, just empty space) */}
            <View style={{ width: 8 * customScale }} />
          </View>
        </View>

        {/* Bottom Left: Weight List */}
        {showPlateList && (
          <View
            style={{ bottom: 24 * customScale, left: 24 * customScale }}
            className="absolute z-30 px-4">
            <Text
              style={{ fontSize: 36 * customScale }}
              className="text-left font-black leading-tight text-gray-900 dark:text-white">
              {plates.length === 0
                ? 'Leere Hantel'
                : [
                    ...innerPlates.map((p) => p.weight + (p.text ? p.text : '') + 'kg'),
                    ...(hasCollars ? ['Verschlüsse'] : []),
                    ...outerPlates.map((p) => p.weight + (p.text ? p.text : '') + 'kg'),
                  ].join(', ')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function PlateItem({ plate, customScale = 1.0 }: { plate: Plate; customScale?: number }) {
  // Determine scale key
  const scaleKey = plate.type === 'training' ? `${plate.weight}-training` : `${plate.weight}`;
  const heightScale = VISUALIZER_CONFIG.diameter[scaleKey] || 0.3; // Fallback to small
  const height = VISUALIZER_CONFIG.maxPlateHeight * heightScale * customScale;
  const width = (VISUALIZER_CONFIG.thickness[plate.weight] || 10) * customScale;

  // Use black text for yellow (#F2C94C) and white (#F8F9FA) plates
  const isLightPlate = plate.color === '#F2C94C' || plate.color === '#F8F9FA';
  const textColorClass = isLightPlate ? 'text-black' : 'text-white';

  return (
    <View
      className="z-10 items-center justify-center shadow-sm"
      style={{
        height: height,
        width: width,
        marginHorizontal: VISUALIZER_CONFIG.plateGap * customScale,
        backgroundColor: plate.color,
        borderColor: plate.borderColor || 'rgba(0,0,0,0.1)',
        borderWidth: plate.borderColor ? 2 * customScale : 0,
        borderRadius: 2 * customScale,
      }}>
      {plate.text ? (
        <Text
          style={{ fontSize: 20 * customScale }}
          className={cn('font-black opacity-90', textColorClass)}>
          {plate.text}
        </Text>
      ) : width > 12 * customScale ? (
        <Text
          style={{ fontSize: (width > 20 * customScale ? 24 : 14) * customScale }}
          className={cn('font-black', textColorClass)}>
          {plate.weight}
        </Text>
      ) : null}
    </View>
  );
}

function CollarItem({ customScale = 1.5 }: { customScale?: number }) {
  return (
    <View
      className="z-10 items-center justify-center"
      style={{ marginHorizontal: VISUALIZER_CONFIG.plateGap * customScale }}>
      {/* The main collar body */}
      <View
        className="relative overflow-hidden rounded-sm border-gray-400 bg-gray-300 shadow-sm dark:bg-zinc-300"
        style={{
          width: VISUALIZER_CONFIG.bar.collarWidth * customScale,
          height: VISUALIZER_CONFIG.bar.collarHeight * customScale,
          borderWidth: 2 * customScale,
          borderRadius: 2 * customScale,
        }}>
        <View
          className="absolute bottom-2 left-1 right-1 top-2 border-gray-400/30"
          style={{ borderLeftWidth: 2 * customScale }}
        />
      </View>
      {/* Screw handle visual */}
      <View
        className="absolute bg-gray-400"
        style={{
          top: -3 * customScale,
          height: 24 * customScale,
          width: 24 * customScale,
          borderRadius: 9999,
        }}
      />
    </View>
  );
}
