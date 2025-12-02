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
import { calculatePlates } from '@/lib/iwf';
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
          title: 'Competition Plate Calculator',
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

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        scrollEnabled={!isSwiping}>
        <View className="flex-1 items-center px-4 pt-6">
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
            isSwiping={isSwiping}
            setIsSwiping={setIsSwiping}
          />

          <View className="mt-10 items-center">
            <Text className="text-xs text-gray-300 dark:text-gray-700">
              Made with ❤️ from{' '}
              <a href="https://sergiolaubner.de" target="_blank" rel="noopener noreferrer">
                Sergio
              </a>
              .
            </Text>
            {/* <Text className="mt-1 text-[10px] text-gray-300 dark:text-gray-700">
              Collars: Men ≥ 30kg, Women ≥ 25kg
            </Text> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
