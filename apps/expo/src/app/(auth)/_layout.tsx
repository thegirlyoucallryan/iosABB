import { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { Provider } from "react-redux";
import { useAppSelector} from '../hooks/hooks'

import { store } from "../../../../../packages/store/store";

const AuthLayout = () => {
  const navState = useRootNavigationState();

  const segments = useSegments();
  const { isAuthenticated } = useAppSelector((s) => s.isAuthenticated);
  const router = useRouter();
  useEffect(() => {
    if (!navState?.routes) return;
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !isAuthenticated &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.push({pathname: "/Welcome"});
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.push("/ChooseAnApparatus");
    }
  }, [segments, isAuthenticated]);
  return (

      <SafeAreaProvider>
        <Provider store={store}>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar />
        </Provider>
      </SafeAreaProvider>
    
  );
};

export default AuthLayout;
