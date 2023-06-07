import  { useEffect } from "react";
import { Image, View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Tabs,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider, useDispatch, useSelector } from "react-redux";

import { TRPCProvider } from "~/utils/api";
import { Icon } from "~/components/Icon";
import { Colors } from "~/constants/colors";
import { logout } from "~/store/auth";
import { store } from "../../store/store";
import FirebaseAuthSvc from "../../../../../packages/firebase/FirebaseAuth";

const RootLayout = () => {
  const dispatch = useDispatch();
  const navState = useRootNavigationState();
  const segments = useSegments();
  const { isAuthenticated } = useSelector((s) => s.isAuthenticated);
  const apparatus = useSelector((s) => s.user.apparatus)
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
      router.replace("/(apparatus)/ChooseAnApparatus");
    }
  }, [segments, isAuthenticated]);
  return (
    <TRPCProvider>
      <SafeAreaProvider>
        <Provider store={store}>
          <Tabs
            screenOptions={({ route }) => ({
              tabBarHideOnKeyboard: true,

              tabBarStyle: {
                backgroundColor: Colors.backgroundBlk,
              },
              headerStyle: {
                backgroundColor: Colors.backgroundBlk,
              },
              headerTintColor: Colors.bone,
              headerTitleStyle: {
                fontFamily: "Prata",
                textAlign: "center",
              },
              tabBarLabelStyle: {
                color: Colors.bone,
                fontSize: 11,
                paddingBottom: 3,
              },
              headerLeft: () => {
                return (
                  <Image
                    source={require("../../../assets/logo.png")}
                    className="mx-2 h-12 w-8"
                  />
                );
              },

              headerRight: () => {
                return (
                  <View className="flex flex-row px-4 items-center">
                    {apparatus && <Text className="text-primaryLight mx-8 text-xl" style={{fontFamily: 'Prata'}}>{apparatus}</Text>}
                    <Icon
                      name="location-exit"
                      size={23}
                      color={Colors.primary}
                      text={"LogOut"}
                      textStyle={{ fontSize: 9 }}
                      onPress={() => {
                        dispatch(logout(""));
                        FirebaseAuthSvc.logoutUser()
                      }}
                    />
                    
                    {/* <MaterialCommunityIcons
                      name="dots-vertical"
                      size={23}
                      color={Colors.primary}
                    /> */}
                  </View>
                );
              },
              tabBarIcon: ({ focused }) => {
                let iconName = "";

                if (route.key == "Home") {
                  iconName = focused ? "home-outline" : "home";
                } else if (route.name === "AddTrick") {
                  iconName = focused ? "plus-box" : "plus";
                } else if (route.name === "Blackbook") {
                  iconName = focused
                    ? "book-open-page-variant"
                    : "book-open-page-variant-outline";
                } else if (route.name === "TrainingDay") {
                  iconName = focused
                    ? "star-shooting"
                    : "star-shooting-outline";
                }
                return (
                  <MaterialCommunityIcons
                    name={iconName}
                    size={23}
                    color={
                      focused ? Colors.primaryLight : Colors.primaryGreenLight
                    }
                  />
                );
              },
            })}
          >
            <Tabs.Screen
              key={"Home"}
              name={"Home"}
              options={{
                headerTitle: "Home",
                tabBarLabel: "Home",
                tabBarIcon: ({ focused }) => (
                  <MaterialCommunityIcons
                    name={focused ? "home" : "home-outline"}
                    color={focused ? Colors.primaryLight : Colors.primaryGreen}
                    size={25}
                  />
                ),
              }}
            />
          </Tabs>
          <StatusBar />
        </Provider>
      </SafeAreaProvider>
    </TRPCProvider>
  );
};

export default RootLayout;
