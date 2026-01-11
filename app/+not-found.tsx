import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Hoppla!' }} />
      <View>
        <Text>Dieser Bildschirm existiert nicht.</Text>

        <Link href="/">
          <Text>Zur Startseite!</Text>
        </Link>
      </View>
    </>
  );
}
