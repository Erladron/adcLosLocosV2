import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.adcloslocos_desa.app',
  appName: 'Los Locos',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  // 🚀 AÑADE ESTE BLOQUE DE PLUGINS SI NO LO TIENES:
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;