import type { ExpoConfig } from "@expo/config";


const defineConfig = (): ExpoConfig => ({
  name: "Aerial Black Book",
  slug: "expo",
  scheme: "expo",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/logo.png",
    resizeMode: "contain",
    backgroundColor: "#232323",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
 
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.aerialblackbook",
    
  },
  android: {
    package: "com.aerialblackbook",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
    },
  },
  extra: {
    environment: 'dev',
    apiUrl: "https://aerial-blackbook-default-rtdb.firebaseio.com"
  },
  plugins: ["./expo-plugins/with-modify-gradle.js"],
});

export default defineConfig;
