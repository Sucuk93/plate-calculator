import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { MoonStar, Sun } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onPress={toggleColorScheme}
      className="rounded-full"
    >
      <Icon 
        as={colorScheme === 'dark' ? MoonStar : Sun} 
        className="text-gray-900 dark:text-gray-100 size-6" 
        size={24}
      />
    </Button>
  );
}
