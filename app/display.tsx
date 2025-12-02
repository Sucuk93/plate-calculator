import React, { useMemo } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { calculatePlates } from '@/lib/iwf';
import { PlateVisualizer } from '@/components/PlateVisualizer';
import { usePlateSync } from '@/hooks/usePlateSync';
import { Stack } from 'expo-router';

export default function DisplayScreen() {
  // Initialize as a receiver
  const { weight, barType } = usePlateSync(25, 'MEN', true);

  const result = useMemo(() => {
    return calculatePlates(weight, barType);
  }, [weight, barType]);

  return (
    <View className="flex-1 items-center justify-center bg-white p-8 dark:bg-black">
      <Stack.Screen options={{ headerShown: false, title: 'External Display' }} />
      <StatusBar barStyle="light-content" />

      {/* Big Weight Display */}
      <Text className="mb-10 text-[120px] font-black leading-tight text-gray-900 dark:text-white">
        {weight}
        <Text className="text-4xl text-gray-500">kg</Text>
      </Text>

      {/* Visualizer */}
      <View className="w-full max-w-3xl scale-125 transform">
        <PlateVisualizer plates={result.plates} hasCollars={result.hasCollars} />
      </View>

      {/* Bar Info */}
      <Text className="mt-16 text-2xl font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {barType === 'MEN' ? 'Männerhantel (20kg)' : 'Frauenhantel (15kg)'}
      </Text>
    </View>
  );
}
