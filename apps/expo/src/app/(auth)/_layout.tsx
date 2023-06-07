import { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Stack,
  useNavigation,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { Provider, useSelector } from "react-redux";

import { TRPCProvider } from "~/utils/api";
import { store } from "~/store/store";

const AuthLayout = () => {
  const navState = useRootNavigationState();

  const segments = useSegments();
  const { isAuthenticated } = useSelector((s) => s.isAuthenticated);
  const router = useRouter();
  useEffect(() => {
    if (!navState?.key) return;
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !isAuthenticated &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("Welcome");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/ChooseAnApparatus");
    }
  }, [segments, isAuthenticated]);
  return (
    <TRPCProvider>
      <SafeAreaProvider>
        <Provider store={store}>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar />
        </Provider>
      </SafeAreaProvider>
    </TRPCProvider>
  );
};

export default AuthLayout;
