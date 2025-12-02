import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { calculatePlates, BAR_WEIGHTS } from '@/lib/iwf';
import { PlateVisualizer } from '@/components/PlateVisualizer';
import { WeightControls } from '@/components/WeightControls';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function PlateCalculatorScreen() {
  const [barType, setBarType] = useState<'MEN' | 'WOMEN'>('MEN');
  // Default start weights
  const [weight, setWeight] = useState(25);

  const result = useMemo(() => {
    return calculatePlates(weight, barType);
  }, [weight, barType]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      {/* Set Status Bar Style */}
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
        <View className="flex-1 items-center px-4 pt-6">
          {/* Header */}
          <View className="mb-8 w-full flex-row items-start justify-between px-2">
            <View>
              <Text className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                Rechner
              </Text>
              <Text className="font-medium text-gray-500 dark:text-gray-400">
                Wettkampf Hantelbeladung
              </Text>
            </View>
            <ThemeToggle />
          </View>

          {/* Visualizer Area */}
          <View className="mb-8 w-full">
            <PlateVisualizer plates={result.plates} hasCollars={result.hasCollars} />
          </View>

          {/* Error / Info Message */}
          {!result.isValid && (
            <View className="mb-4 rounded-md bg-red-50 px-4 py-2 dark:bg-red-900/20">
              <Text className="font-medium text-red-600 dark:text-red-400">
                {result.error || 'Invalid Weight'}
              </Text>
            </View>
          )}

          {/* Remainder Warning (if any floating point issues or un-makeable weights) */}
          {result.remainder > 0 && (
            <View className="mb-4 rounded-md bg-yellow-50 px-4 py-2 dark:bg-yellow-900/20">
              <Text className="font-medium text-yellow-600 dark:text-yellow-400">
                Remainder: {result.remainder}kg (Cannot fill exact weight)
              </Text>
            </View>
          )}

          {/* Controls */}
          <WeightControls
            weight={weight}
            setWeight={setWeight}
            barType={barType}
            setBarType={setBarType}
          />

          {/* <View className="mt-10 items-center">
            <Text className="text-xs text-gray-300 dark:text-gray-700">
              Standard IWF Loading Rules Apply
            </Text>
            <Text className="mt-1 text-[10px] text-gray-300 dark:text-gray-700">
              Collars: Men ≥ 30kg, Women ≥ 25kg
            </Text>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
