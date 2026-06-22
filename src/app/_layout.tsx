import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import ListExample from '@/components/ui/list';
import { ItemsProvider } from '@/context/itemsContext';
import { migrate } from '@/database/migrations';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  migrate();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <ItemsProvider>
      <AppTabs />
      </ItemsProvider>
    </ThemeProvider>
  );
}
