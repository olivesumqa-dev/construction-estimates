import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.strucforge.estimates',
  appName: 'Strucforge Estimates Pro v5.0',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
