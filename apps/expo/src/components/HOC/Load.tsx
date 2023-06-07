import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { Colors } from "~/constants/colors";

const Load = ({ animating }: { animating: boolean }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={animating}
        color={Colors.primaryLight}
        size="large"
      />
      <Text style={styles.text}> ... Loading</Text>
    </View>
  );
};
export default Load;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundBlk,
    padding: 70,
  },
  text: {
    color: Colors.bone,
    fontFamily: "Prata",
    fontSize: 20,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 50,
  },
});
