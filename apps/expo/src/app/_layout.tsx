import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider, useDispatch } from "react-redux";
import { TRPCProvider } from "~/utils/api";
import { authenticate } from "~/store/auth";
import { store } from "../store/store";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { View, Text } from "react-native";
import { Colors } from "~/constants/colors";

// This is the main layout of the app
// It wraps your pages with the providers they need

const RootLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchTokenFromDevice() {
      const storedToken = await AsyncStorage.getItem("ABB_token");

      const storedUser = await AsyncStorage.getItem("ABB_userId");

      if (!storedToken) {
        dispatch(
          authenticate({
            token: storedToken,
            userName: "",
            userId: storedUser,
          })
        );
      }
    }
    fetchTokenFromDevice();
  }, []);
  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: Colors.primaryGreenLight,
          backgroundColor: "black",
          fontFamily: "Prata",
          height: 85,
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,

          color: Colors.bone,
        }}
        text1Style={{
          fontSize: 18,
          fontFamily: "Prata",
          color: Colors.primaryLight,
        }}
        text2Style={{
          fontSize: 15,
          color: Colors.primaryGreenLight,
        }}
        text2NumberOfLines={3}
      />
    ),

    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: Colors.accentDark,
          backgroundColor: "black",
          fontFamily: "Prata",
          height: 85,
        }}
        contentContainerStyle={{
          paddingHorizontal: 15,

          color: Colors.bone,
        }}
        text1Style={{
          fontSize: 18,
          fontFamily: "Prata",
          color: Colors.bone,
        }}
        text2Style={{
          fontSize: 15,
          color: Colors.accentDark,
        }}
        text2NumberOfLines={3}
      />
    ),
  };

  return (
    <TRPCProvider>
      <SafeAreaProvider>
        <Provider store={store}>
          <Stack screenOptions={{ headerShown: false }} />
          <Toast config={toastConfig} />
          <StatusBar />
        </Provider>
      </SafeAreaProvider>
    </TRPCProvider>
  );
};

export default RootLayout;
