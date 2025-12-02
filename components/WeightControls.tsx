import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  PanResponder,
} from 'react-native';
import { BAR_WEIGHTS } from '@/lib/iwf';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface WeightControlsProps {
  weight: number;
  setWeight: (w: number) => void;
  barType: 'MEN' | 'WOMEN';
  setBarType: (t: 'MEN' | 'WOMEN') => void;
  isSwiping: boolean;
  setIsSwiping: (v: boolean) => void;
}

export function WeightControls({ weight, setWeight, barType, setBarType, isSwiping, setIsSwiping }: WeightControlsProps) {
  const minWeight = barType === 'MEN' ? BAR_WEIGHTS.MEN : BAR_WEIGHTS.WOMEN;

  const handleIncrement = (amount: number) => {
    const newWeight = weight + amount;
    if (newWeight >= minWeight) {
      setWeight(newWeight);
    }
  };

  const handleDecrement = (amount: number) => {
    const newWeight = weight - amount;
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

  // Gesture Handler Logic
  const startWeightRef = useRef(weight);
  const lastDeltaRef = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only claim if horizontal movement is significant AND dominant (horizontal > vertical)
        // This prevents blocking vertical scrolling when the user intends to scroll the page
        return (
          Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
        );
      },
      onPanResponderGrant: () => {
        setIsSwiping(true);
        startWeightRef.current = weight;
        lastDeltaRef.current = 0;
      },
      // Rejects termination requests from parent ScrollViews to keep control once dragging starts
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, gestureState) => {
        // Sensitivity: 1kg per 20 pixels of drag (Smoother)
        const PIXELS_PER_KG = 20;
        // Use Math.round for symmetric behavior around 0
        const deltaKg = Math.round(gestureState.dx / PIXELS_PER_KG);

        // Only update if the integer value changed since last update to avoid spamming state
        if (deltaKg !== lastDeltaRef.current) {
          let newWeight = startWeightRef.current + deltaKg;

          // Enforce min weight
          if (newWeight < minWeight) newWeight = minWeight;

          setWeight(newWeight);
          lastDeltaRef.current = deltaKg;
        }
      },
      onPanResponderRelease: () => {
        setIsSwiping(false);
        lastDeltaRef.current = 0;
      },
      onPanResponderTerminate: () => {
        setIsSwiping(false);
        lastDeltaRef.current = 0;
      },
    })
  ).current;

  const handleWheel = (e: any) => {
    if (Platform.OS === 'web') {
      // Simple threshold for wheel events
      if (e.deltaY < 0) {
        handleIncrement(1);
      } else if (e.deltaY > 0) {
        handleIncrement(-1);
      }
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

          {/* Swipeable Input Area */}
          <View
            {...panResponder.panHandlers}
            // @ts-ignore
            onWheel={handleWheel}
            className="mx-2 min-w-[140px] items-center justify-center rounded-xl bg-gray-100 py-6 shadow-sm dark:bg-gray-800">
            <TextInput
              value={weight.toString()}
              // editable={!isSwiping}
              editable={false}
              onChangeText={(text) => {
                const val = parseFloat(text);
                if (!isNaN(val) && val >= minWeight) {
                  setWeight(val);
                }
              }}
              keyboardType="numeric"
              className={cn(
                'w-full text-center text-5xl font-black text-gray-900 dark:text-white',
                isSwiping && 'opacity-50'
              )}
            />
            <Text className="absolute bottom-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 opacity-80 dark:text-gray-500">
              {isSwiping ? 'Adjusting...' : 'Swipe ↔'}
            </Text>
          </View>

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
          onPress={() => handleDecrement(1)}
          className="bg-gray-100 dark:bg-gray-800">
          -1kg
        </Button>
        <Button
          variant="ghost"
          onPress={() => handleDecrement(2)}
          className="bg-gray-100 dark:bg-gray-800">
          -2kg
        </Button>

        <Button
          variant="ghost"
          onPress={() => handleDecrement(5)}
          className="bg-gray-100 dark:bg-gray-800">
          -5kg
        </Button>
        <Button
          variant="ghost"
          onPress={() => handleDecrement(10)}
          className="bg-gray-100 dark:bg-gray-800">
          -10kg
        </Button>
        <Button
          variant="ghost"
          onPress={() => handleDecrement(20)}
          className="bg-gray-100 dark:bg-gray-800">
          -20kg
        </Button>
      </View>

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

      {/* Mobile "Slider" / Ruler Concept */}
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
