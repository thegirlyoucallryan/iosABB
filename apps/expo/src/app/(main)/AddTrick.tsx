import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useNavigation, useSearchParams } from "expo-router";
import { Tricks } from "@prisma/client";
import { useDispatch, useSelector } from "react-redux";

import { api } from "~/utils/api";
import { Colors } from "~/constants/colors";
import { editTrickData, sendTrickData } from "~/store/tricks-redux";
import AddForm from "../../components/AddForm";

const AddTrick = () => {
  const dispatch = useDispatch();
  const { trick: trickToEdit, isEditing: isEditing } = useSearchParams();

  // console.log(isEditing, "isediiiting");
  const token = useSelector((state) => state.token.token);
  const userId = useSelector((state) => state.userId.userId);
  const apparatus = useSelector((s) => s.user.apparatus)
  const nav = useNavigation();
  

  const saveTrickHandler = (trick: Tricks) => {
    dispatch(sendTrickData(trick, token, userId, apparatus));

    nav.navigate("Blackbook", {
      trick: trick,
    });
  };
  const editTrickHandler = (trick: Tricks) => {
    console.log(trick, "triiickk");
    dispatch(editTrickData(trick, token, userId, apparatus));
    nav.navigate("Details", {
      data: trick.title,
    });
  };

  const options = [
    "Climb",
    "Conditioning",
    "Drop",
    "Belay",
    "Split",
    "Roll",
    "Pose",
    "Other",
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.add}>Create New Entry</Text>
      <AddForm
        onSave={!!isEditing ? editTrickHandler : saveTrickHandler}
        dropDownOptions={options}
        isEditing={!!isEditing}
        trick={trickToEdit}
      />
    </ScrollView>
  );
};

export default AddTrick;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundBlk,
    flex: 1,
  },
  add: {
    color: Colors.bone,
    fontFamily: "Prata",
    fontSize: 20,
    paddingTop: 15,
    marginLeft: 10,
  },
});
