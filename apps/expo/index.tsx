import { registerRootComponent } from "expo";
import { useFonts } from "expo-font";
import { ExpoRoot } from "expo-router";
import { Provider } from "react-redux";
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import {store} from '../../packages/store/store'

import { GestureHandlerRootView } from "react-native-gesture-handler";



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
      <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient} >
      <ExpoRoot context={ctx} />
      </QueryClientProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

registerRootComponent(App);
