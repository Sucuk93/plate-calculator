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
    <View className="flex-1 bg-white dark:bg-black items-center justify-center p-8">
      <Stack.Screen options={{ headerShown: false, title: 'External Display' }} />
      <StatusBar barStyle="light-content" /> 

      {/* Big Weight Display */}
      <Text className="text-[120px] font-black text-gray-900 dark:text-white leading-tight mb-10">
        {weight}<Text className="text-4xl text-gray-500">kg</Text>
      </Text>

      {/* Visualizer */}
      <View className="w-full max-w-3xl transform scale-125">
         <PlateVisualizer plates={result.plates} hasCollars={result.hasCollars} />
      </View>

      {/* Bar Info */}
      <Text className="mt-16 text-2xl text-gray-400 dark:text-gray-500 font-bold tracking-widest uppercase">
        {barType === 'MEN' ? "Men's Bar (20kg)" : "Women's Bar (15kg)"}
      </Text>

    </View>
  );
}
