import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.adcloslocos_desa.app',
  appName: 'Los Locos',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    StatusBar: {
      overlaysWebView: true
    }
  },
};

export default config;