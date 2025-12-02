import React, { useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { calculatePlates } from '@/lib/iwf';
import { PlateVisualizer } from '@/components/PlateVisualizer';
import { WeightControls } from '@/components/WeightControls';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'expo-router';
import { usePlateSync } from '@/hooks/usePlateSync';
import { Icon } from '@/components/ui/icon';
import { Monitor } from 'lucide-react-native';

export default function PlateCalculatorScreen() {
  // Use the sync hook to manage state and broadcast changes
  const { weight, setWeight, barType, setBarType } = usePlateSync(25, 'MEN');

  const result = useMemo(() => {
    return calculatePlates(weight, barType);
  }, [weight, barType]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
       {/* Set Status Bar Style */}
       <StatusBar barStyle="dark-content" /> 
       
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
        <View className="flex-1 items-center pt-6 px-4">
          
          {/* Header */}
          <View className="w-full flex-row justify-between items-start mb-8 px-2">
            <View>
              <Text className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                IWF LOADER
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 font-medium">
                Competition Plate Calculator
              </Text>
            </View>
            <View className="flex-row gap-2">
              {/* External Display Button */}
              <Link href="/display" asChild>
                <TouchableOpacity className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                   <Icon as={Monitor} className="text-gray-900 dark:text-white size-6" size={24} />
                </TouchableOpacity>
              </Link>
              <ThemeToggle />
            </View>
          </View>

          {/* Visualizer Area */}
          <View className="w-full mb-8">
             <PlateVisualizer plates={result.plates} hasCollars={result.hasCollars} />
          </View>

          {/* Error / Info Message */}
          {!result.isValid && (
            <View className="bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-md mb-4">
               <Text className="text-red-600 dark:text-red-400 font-medium">
                 {result.error || "Invalid Weight"}
               </Text>
            </View>
          )}
           
           {/* Remainder Warning (if any floating point issues or un-makeable weights) */}
           {result.remainder > 0 && (
             <View className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-md mb-4">
               <Text className="text-yellow-600 dark:text-yellow-400 font-medium">
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
          
          <View className="mt-10 items-center">
              <Text className="text-xs text-gray-300 dark:text-gray-700">
                  Standard IWF Loading Rules Apply
              </Text>
              <Text className="text-[10px] text-gray-300 dark:text-gray-700 mt-1">
                  Collars: Men ≥ 30kg, Women ≥ 25kg
              </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}