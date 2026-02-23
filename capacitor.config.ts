import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ru.market.tovarov',
  appName: 'Маркет товаров',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
