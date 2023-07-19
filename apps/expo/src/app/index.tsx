import { useEffect, useState } from "react";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { Provider} from "react-redux";

import { store } from "../../../../packages/store/store";
import { useAppSelector } from "./hooks/hooks";
import { QueryClientProvider, QueryClient } from "react-query";

export default function index({ children }: React.PropsWithChildren) {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.isAuthenticated);

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

  const [queryClient] = useState(() => new QueryClient());
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
