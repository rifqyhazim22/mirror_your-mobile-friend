import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mirror.friend",
  appName: "Mirror",
  webDir: "apps/web/out",
  bundledWebRuntime: false,
  loggingBehavior: "production",
  server: {
    androidScheme: "https",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#060318"
    }
  }
};

export default config;
