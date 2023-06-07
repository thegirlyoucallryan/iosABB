import { View, StyleSheet } from "react-native";
import { Colors } from "~/constants/colors";

export const ScreenWrapper = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundBlk,
    padding: 10,
    flex: 1,
  },
});
