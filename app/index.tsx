import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { calculatePlates, BAR_WEIGHTS } from '@/lib/iwf';
import { PlateVisualizer } from '@/components/PlateVisualizer';
import { WeightControls } from '@/components/WeightControls';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link, Stack } from 'expo-router';
import { usePlateSync } from '@/hooks/usePlateSync';
import { Icon } from '@/components/ui/icon';
import { Monitor } from 'lucide-react-native';

export default function PlateCalculatorScreen() {
  // Use the sync hook to manage state and broadcast changes
  const { weight, setWeight, barType, setBarType } = usePlateSync(25, 'MEN');
  const [isSwiping, setIsSwiping] = useState(false);

  const result = useMemo(() => {
    return calculatePlates(weight, barType);
  }, [weight, barType]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      {/* Set Status Bar Style */}
      <StatusBar barStyle="dark-content" />

      <Stack.Screen
        options={{
          title: 'Wettkampf Hantelrechner',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => (
            <View className="flex-row items-center gap-2">
              {/* External Display Button */}
              <Link
                href="/display"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2">
                <TouchableOpacity className="rounded-full p-2">
                  <Icon as={Monitor} className="size-5 text-gray-900 dark:text-white" size={20} />
                </TouchableOpacity>
              </Link>
              <ThemeToggle />
            </View>
          ),
        }}
      />

      <View className="mx-auto w-full max-w-7xl flex-1 gap-4 px-4 pb-4">
        {/* Visualizer Area (Takes remaining space) */}
        <View className="mb-8 w-full flex-1 justify-center">
          <PlateVisualizer
            plates={result.plates}
            hasCollars={result.hasCollars}
            barWeight={barType === 'MEN' ? BAR_WEIGHTS.MEN : BAR_WEIGHTS.WOMEN}
            showPlateList={false}
          />
        </View>

        {/* Error / Info Message (Conditional) */}
        <View>
          {!result.isValid && (
            <View className="mb-2 rounded-md bg-red-50 px-4 py-2 dark:bg-red-900/20">
              <Text className="text-lg font-bold text-red-600 dark:text-red-400">
                {result.error || 'Ungültiges Gewicht'}
              </Text>
            </View>
          )}

          {/* Remainder Warning */}
          {result.remainder > 0 && (
            <View className="mb-2 rounded-md bg-yellow-50 px-4 py-2 dark:bg-yellow-900/20">
              <Text className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                Rest: {result.remainder}kg (Nicht exakt ladbar)
              </Text>
            </View>
          )}
        </View>

        {/* Controls (Fixed at bottom part) */}
        <View className="mt-24 w-full items-center">
          <WeightControls
            weight={weight}
            setWeight={setWeight}
            barType={barType}
            setBarType={setBarType}
            isSwiping={isSwiping}
            setIsSwiping={setIsSwiping}
          />

          <View className="mt-4 items-center">
            <Text className="text-xs text-gray-300 dark:text-gray-700">
              Entwickelt mit ❤️ von{' '}
              <a href="https://sergiolaubner.de" target="_blank" rel="noopener noreferrer">
                Sergio
              </a>
              für den SCR Tremonia.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
