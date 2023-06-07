import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { ScreenWrapper } from "~/components/ui/ScreenWrapper";
import { Colors } from "~/constants/colors";
import { setCurrentApparatus } from "~/store/user-redux";

import FbFirestoreService from "../../../../packages/firebase/FirebaseCloudService";

import { useMutation } from "react-query";
import Toast from "react-native-toast-message";

const ChooseAnApparatus = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [apparatus, setApparatus] = useState<string>(null);
  const apparatusOptions = ["Silks", "Lyra", "Trapeze", "Hammock"];
  const userId = useSelector((s) => s.userId.userId);

  const apparatusMutation = useMutation({
    mutationFn: async (apparatus: string) =>
      await FbFirestoreService.updateDocument("users", userId, {
        apparatus: apparatus,
      }),
    onSuccess: () => router.replace("/(main)/Home"),
    onError: (err: string) => {
      Toast.show({
        type: "error",
        text1: "Woops!",
        text2: err,
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
  }, [apparatus, dispatch, setCurrentApparatus]);

  return (
    <ScreenWrapper>
      <Text className="text-primary text-center align-center text-2xl m-12 mt-44">
        Which Apparatus are you training?
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
    // borderColor: "white",
    // borderWidth: 1,
  },
  dropdownBTN: {
    // marginTop: 10,
    // marginBottom: 10,
    borderRadius: 8,
    paddingTop: 18,
    alignItems: "center",
    borderColor: Colors.primaryLight,
    borderWidth: 0.6,
    justifyContent: "center",
  },
});
