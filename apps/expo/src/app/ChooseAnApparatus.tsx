import { Link, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ScreenWrapper } from "~/components/ui/ScreenWrapper";
import { Colors } from "~/constants/colors";
import { setCurrentApparatus } from "../../../../packages/store/user-redux";
import FbFirestoreService from "../../../../packages/firebase/FirebaseCloudService";
import { logout } from "../../../../packages/store/auth";
import FirebaseAuthSvc from "../../../../packages/firebase/FirebaseAuth";
import { Apparatus } from "../../../../packages/store/tricks-redux";
import { useMutation } from "react-query";
import Toast from "react-native-toast-message";
import { Icon } from "~/components/Icon";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";

const ChooseAnApparatus = () => {
  const nav = useNavigation();
  const dispatch = useAppDispatch();
  const [apparatus, setApparatus] = useState<Apparatus>(null);
  const apparatusOptions = ["Silks", "Lyra", "Trapeze", "Hammock"];
  const userId = useAppSelector((s) => s.userId.userId);
  const userName = useAppSelector((s) => s.isAuthenticated.userName);
  const [showLink, setShowLink] = useState<boolean>(false);


  useEffect(() => {
    nav.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: Colors.backgroundBlk,
      },
      headerTitleStyle: { color: Colors.primaryLight, fontFamily: "Prata" },
      headerTintColor: Colors.primaryGreen,
      headerTitle: "Apparatus",
      headerLeft: () => {
        return (
          <Icon
            name="arrow-left"
            color={Colors.accentDark}
            size={22}
            onPress={() => {
              dispatch(logout({ token: "", isAuthenticated: false }));
              FirebaseAuthSvc.logoutUser();
            }}
          />
        );
      },
    });
  },[])
 

  const apparatusMutation = useMutation({
    mutationFn: async (apparatus: Apparatus) =>
      await FbFirestoreService.updateDocument("users", userId, {
        apparatus: apparatus,
      }),
    onSuccess: () => {
      setShowLink(true);
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Woops!",
        text2:
          "We are having technical difficulties try logging out and back in again.",
      });
    },
  });

  const updateUser = () => {
    if (apparatus !== null) {
      apparatusMutation.mutateAsync(apparatus);
    }
  };

  useEffect(() => {
    dispatch(setCurrentApparatus(apparatus));
    if (apparatus !== null) {
      updateUser();
    }
  }, [apparatus, dispatch]);

  return (
    <ScreenWrapper>
      <Text className="text-bone font-sans text-2xl mt-6">
        Welcome, {userName.charAt(0).toUpperCase() + userName.slice(1)}
      </Text>
      <Text className="text-bone font-sans text-center align-center text-3xl m-12 mt-24">
        What apparatus will you be training today?
      </Text>
      <SelectDropdown
        data={apparatusOptions}
        onSelect={(value) => {
          setApparatus(value);
        }}
        defaultButtonText={"Select an apparatus"}
        dropdownOverlayColor={Colors.backgroundGr}
        rowStyle={{ ...styles.rowText }}
        rowTextStyle={styles.rowText}
        renderCustomizedRowChild={(value) => (
          <View className="flex flex-row justify-between px-5">
            <Text style={styles.rowText}>{value}</Text>
            <MaterialCommunityIcons
              name="star-check"
              size={18}
              color={Colors.primaryLight}
            />
          </View>
        )}
        buttonStyle={{ ...styles.dropdown, ...styles.dropdownBTN }}
        buttonTextStyle={styles.dropdown}
        renderDropdownIcon={() => (
          <MaterialCommunityIcons
            name="arrow-down-drop-circle"
            size={23}
            color={Colors.primaryLight}
          />
        )}
      />
      {showLink && (
        <Link
          className="text-primaryLight  rounded-md text-xl font-sans mt-40 py-2  text-center items-center  "
          href={{ pathname: "/(main)/Home", params: { apparatus: apparatus } }}
        >
          {`Get Started  `}
          <MaterialCommunityIcons
            name="arrow-right-circle"
            size={20}
            color={Colors.primaryLight}
          />
        </Link>
      )}
      {apparatusMutation.isLoading && (
        <ActivityIndicator
          size={"large"}
          color={Colors.primaryGreenLight}
          className="p-16"
        />
      )}
    </ScreenWrapper>
  );
};

export default ChooseAnApparatus;

export const styles = StyleSheet.create({
  rowText: {
    backgroundColor: Colors.backgroundBlk,
    color: Colors.primaryLight,
    fontFamily: "Prata",
    fontSize: 14,
    borderBottomColor: "transparent",
  },

  dropdown: {
    color: Colors.primaryLight,
    fontFamily: "Prata",
    backgroundColor: Colors.backgroundBlk,
    alignSelf: "center",
    justifyContent: "center",
    height: 50,
    fontSize: 14,
  },
  dropdownBTN: {
    borderRadius: 8,
    paddingTop: 18,
    alignItems: "center",
    borderColor: Colors.primaryLight,
    borderWidth: 0.6,
    justifyContent: "center",
  },
});
