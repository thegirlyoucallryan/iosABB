import { useCallback, useEffect } from "react";
import { Image, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Tabs,
  useFocusEffect,
  useNavigation,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { Icon } from "~/components/Icon";
import { Colors } from "~/constants/colors";
import { logout } from "../../../../../packages/store/auth";
import { store } from "../../../../../packages/store/store";
import FirebaseAuthSvc from "../../../../../packages/firebase/FirebaseAuth";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { Trick } from "../../../../../packages/store/tricks-redux";

type RootStackParamList = {
  SignUp: undefined,
  Login: undefined,
  CreatePost: undefined;
  Home: undefined,
  Welcome: undefined,
  AddTrick: {id: string, isEditing: boolean}
  Blackbook: undefined,
  Details: {data: Trick},
  TrickDetails: {id: string}
  };


declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const RootLayout = () => {
  const dispatch = useAppDispatch();
  const navState = useRootNavigationState();
  const segments = useSegments();
  const { isAuthenticated } = useAppSelector((s) => s.isAuthenticated);
  const apparatus = useAppSelector((s) => s.user.apparatus?.toString());
  const router = useRouter();
  const nav = useNavigation()


  

  useEffect(() => {
    if (!navState?.key) return;
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !isAuthenticated &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.push({ pathname: "/(auth)/Welcome" });
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.push("/(apparatus)/ChooseAnApparatus");
    }
  }, [segments, isAuthenticated]);
  return (
  
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
              headerTitle: apparatus,
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
                    <Icon
                      name="location-exit"
                      size={23}
                      color={Colors.primary}
                      text={"LogOut"}
                      textStyle={{ fontSize: 9 }}
                      onPress={() => {
                        dispatch(logout({token: '', isAuthenticated: false}));
                        FirebaseAuthSvc.logoutUser();
                      }}
                    />

                
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
                headerTitle: apparatus,
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
            <Tabs.Screen
              key={"Add"}
              name={"AddTrick"}
              // listeners={({ navigation}) => ({
              //   tabPress: (e) => {
              //     // Prevent default action
              //     // e.preventDefault();
            
              //     // Do something with the `navigation` object
              //     navigation.setOptions({screen: "AddTrick", isEditing: false, id: undefined})
              //   },
              // })}
              options={{
                
                unmountOnBlur: true,
                tabBarLabel: "Add",
              
              }}
            />
             <Tabs.Screen
              key={"TrainingDay"}
              name={"TrainingDay"}
              options={{
                tabBarLabel: "Train",
              }}
            />
              <Tabs.Screen
              key={"Blackbook"}
              name={"Blackbook"}
              options={{
                tabBarLabel: "Tricks",
              }}
            />
          </Tabs>
          <StatusBar />
        </Provider>
      </SafeAreaProvider>

  );
};

export default RootLayout;
