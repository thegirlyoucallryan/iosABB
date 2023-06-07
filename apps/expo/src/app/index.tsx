import { useEffect } from "react";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { Provider, useSelector } from "react-redux";

import { store } from "../store/store";

export default function index({ children }: React.PropsWithChildren) {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated } = useSelector((s) => s.isAuthenticated);

  const navState = useRootNavigationState();
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
      router.replace("/(main)/Home");
    }
  }, [segments, isAuthenticated]);
  return <Provider store={store}>{children}</Provider>;
}
