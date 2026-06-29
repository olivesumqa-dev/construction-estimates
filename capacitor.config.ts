import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.strucforge.estimates',
  appName: 'StrucForge Estimates',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
