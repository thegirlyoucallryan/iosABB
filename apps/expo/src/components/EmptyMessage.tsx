import { StyleSheet, Text, View } from "react-native";

import { Colors } from "~/constants/colors";

const EmptyMessage = ({
  headingText,
  msgText,
}: {
  headingText: string;
  msgText: string;
}) => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyMsg}>{headingText}</Text>
      <Text style={styles.emptyP}>{msgText}</Text>
    </View>
  );
};
export default EmptyMessage;

const styles = StyleSheet.create({
  emptyMsg: {
    color: Colors.bone,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    letterSpacing: 1,
    marginBottom: 8,
    paddingHorizontal: 20
  },
  emptyP: {
    color: Colors.bone,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  emptyContainer: {
    marginTop: 70,
    margin: 15,
  },
});
