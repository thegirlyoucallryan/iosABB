import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "~/constants/colors";

export const PrimaryBtn = ({
  onPress,
  text,
}: {
  onPress: () => void;
  text: string;
}) => {
  return (
    <Pressable onPress={onPress}>
      <Text style={{ ...styles.primaryBtn, ...styles.btn }}>{text}</Text>
    </Pressable>
  );
};

export const AccentBtn = ({
  onPress,
  text,
}: {
  onPress: () => void;
  text: string;
}) => {
  return (
    <Pressable onPress={onPress}>
      <Text style={{ ...styles.accentBtn, ...styles.btn }}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    fontFamily: "Prata",
    textAlign: "center",
    borderWidth: 0.5,
    maxWidth: 200,
    minWidth: 100,
    backgroundColor: Colors.backgroundBlk,
    elevation: 10,
  },
  accentBtn: {
    color: Colors.primaryLight,
    borderColor: Colors.primaryLight,
  },
  primaryBtn: {
    color: Colors.bone,
    borderColor: Colors.bone,
  },
});
