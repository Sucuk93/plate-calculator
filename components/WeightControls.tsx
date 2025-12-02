import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { BAR_WEIGHTS } from '@/lib/iwf';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface WeightControlsProps {
  weight: number;
  setWeight: (w: number) => void;
  barType: 'MEN' | 'WOMEN';
  setBarType: (t: 'MEN' | 'WOMEN') => void;
}

export function WeightControls({ weight, setWeight, barType, setBarType }: WeightControlsProps) {
  const minWeight = barType === 'MEN' ? BAR_WEIGHTS.MEN : BAR_WEIGHTS.WOMEN;

  const handleIncrement = (amount: number) => {
    const newWeight = weight + amount;
    if (newWeight >= minWeight) {
      setWeight(newWeight);
    }
  };

  const handleBarChange = (type: 'MEN' | 'WOMEN') => {
    setBarType(type);
    // Adjust weight if it falls below new min
    const newMin = type === 'MEN' ? BAR_WEIGHTS.MEN : BAR_WEIGHTS.WOMEN;
    if (weight < newMin) {
      setWeight(newMin);
    }
  };

  return (
    <View className="w-full max-w-md gap-6 p-4">
      {/* Bar Selector */}
      <View className="flex-row overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          onPress={() => handleBarChange('MEN')}
          className={cn(
            'flex-1 items-center justify-center py-3',
            barType === 'MEN' ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-800'
          )}>
          <Text
            className={cn(
              'font-bold',
              barType === 'MEN' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
            )}>
            Männerhantel (20kg)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleBarChange('WOMEN')}
          className={cn(
            'flex-1 items-center justify-center py-3',
            barType === 'WOMEN' ? 'bg-yellow-500' : 'bg-gray-100 dark:bg-gray-800'
          )}>
          <Text
            className={cn(
              'font-bold',
              barType === 'WOMEN' ? 'text-black' : 'text-gray-700 dark:text-gray-300'
            )}>
            Frauenhantel (15kg)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Weight Display & Direct Input */}
      <View className="items-center gap-2">
        <Text className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Gesamtgewicht (kg)
        </Text>
        <View className="flex-row items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-0 bg-gray-200 dark:bg-gray-800"
            onPress={() => handleIncrement(-1)}>
            <Text className="text-2xl text-gray-600 dark:text-gray-200">-</Text>
          </Button>

          <TextInput
            value={weight.toString()}
            onChangeText={(text) => {
              const val = parseFloat(text);
              if (!isNaN(val) && val >= minWeight) {
                setWeight(val);
              }
            }}
            keyboardType="numeric"
            className="min-w-[40px] py-2 text-center text-5xl font-black text-gray-900 dark:text-white"
          />

          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full border-0 bg-gray-200 dark:bg-gray-800"
            onPress={() => handleIncrement(1)}>
            <Text className="text-2xl text-gray-600 dark:text-gray-200">+</Text>
          </Button>
        </View>
      </View>

      {/* Quick Add Buttons (Optional enhancement) */}
      <View className="flex-row justify-center gap-3">
        <Button
          variant="ghost"
          onPress={() => handleIncrement(1)}
          className="bg-gray-100 dark:bg-gray-800">
          +1kg
        </Button>
        <Button
          variant="ghost"
          onPress={() => handleIncrement(2)}
          className="bg-gray-100 dark:bg-gray-800">
          +2kg
        </Button>

        <Button
          variant="ghost"
          onPress={() => handleIncrement(5)}
          className="bg-gray-100 dark:bg-gray-800">
          +5kg
        </Button>
        <Button
          variant="ghost"
          onPress={() => handleIncrement(10)}
          className="bg-gray-100 dark:bg-gray-800">
          +10kg
        </Button>
        <Button
          variant="ghost"
          onPress={() => handleIncrement(20)}
          className="bg-gray-100 dark:bg-gray-800">
          +20kg
        </Button>
      </View>

      {/* Mobile "Slider" / Ruler Concept 
          Since we can't easily use a native slider without deps, 
          we'll use a horizontal scroll view with values 
      */}
      <View className="mt-4">
        <Text className="mb-2 text-center text-xs text-gray-400">Quick Select</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
          <View className="flex-row gap-2 px-4">
            {Array.from({ length: 20 }).map((_, i) => {
              // Generate some presets based on current weight range
              const start = Math.floor(weight / 10) * 10 - 50;
              const val = (start > minWeight ? start : minWeight) + i * 5;
              if (val < minWeight) return null;

              return (
                <TouchableOpacity
                  key={val}
                  onPress={() => setWeight(val)}
                  className={cn(
                    'h-10 w-14 items-center justify-center rounded-md border',
                    val === weight
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                  )}>
                  <Text
                    className={cn(
                      'font-bold',
                      val === weight ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                    )}>
                    {val}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
