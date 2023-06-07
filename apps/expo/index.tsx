import { registerRootComponent } from "expo";
import { useFonts } from "expo-font";
import { ExpoRoot } from "expo-router";
import { Provider } from "react-redux";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { store } from "~/store/store";
import FirebaseAuthSvc from '../../packages/firebase/FirebaseAuth'
import { useState } from "react";



const queryClient = new QueryClient()

// Must be exported or Fast Refresh won't update the context
export function App() {

  const [loaded] = useFonts({
    Prata: require("./assets/fonts/Prata-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }
  const ctx = require.context("./src/app");



  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient} >
      <ExpoRoot context={ctx} />
      </QueryClientProvider>
     
    </Provider>
  );
}

registerRootComponent(App);
