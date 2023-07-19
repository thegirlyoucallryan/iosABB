import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider, useDispatch, useSelector } from "react-redux";

import { store } from "../../../../packages/store/store";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

import { Colors } from "~/constants/colors";
import { API_KEY } from "@env";
import axios from "axios";

import { browserSessionPersistence, getAuth, setPersistence } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


// This is the main layout of the app
// It wraps your pages with the providers they need

const RootLayout = () => {
  const dispatch = useAppDispatch();
  const navState = useRootNavigationState();
  const segments = useSegments();
  const { isAuthenticated } = useAppSelector((s) => s.isAuthenticated);
  const router = useRouter();
  useEffect(() => {
    async function fetchTokenFromDevice() {

     

      const storedToken = await AsyncStorage.getItem("ABB_token");

      const storedUser = await AsyncStorage.getItem("ABB_userId");
      
      // if (storedToken) {
      
      //       dispatch(
      //         authenticate({
      //           token:storedToken,
      //           userName: 'user.displayName',
      //           userId: storedUser,
      //         })
      //       );
      //     }
        
      }
    
    fetchTokenFromDevice();
  }, []);
  useEffect(() => {
    if (!navState?.key) return;
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !isAuthenticated &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.push({ pathname: "Welcome" });
    }
  }, [segments, isAuthenticated]);
  const toastConfig = {
    success: (props: any) => (
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

    error: (props: any) => (
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

  const [queryClient] = useState(() => new QueryClient());

  return (
<QueryClientProvider client={queryClient}>
<SafeAreaProvider>
        <Provider store={store}>
          <Stack screenOptions={{ headerShown: false }} />
          <Toast config={toastConfig} />
          <StatusBar />
        </Provider>
      </SafeAreaProvider>

</QueryClientProvider>
      

  );
};

export default RootLayout;
