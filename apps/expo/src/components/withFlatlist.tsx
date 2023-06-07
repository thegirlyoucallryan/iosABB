import { FlatList, StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { Colors } from "~/constants/colors";

//objects are not renderable as children, Ryan ({item})
//  keyExtractor is needed Ryan
export const WithFlatlist = ({ data }: { data: any }) => {
  //icons need to be added as parameters and passed in
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <View style={styles.container}>
          <Text style={styles.title}>{item}</Text>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons
              style={styles.icon}
              name="check"
              size={23}
              color={Colors.primaryLight}
            />
            <MaterialCommunityIcons
              style={styles.icon}
              name="close"
              size={23}
              color={Colors.accentDark}
            />
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    color: Colors.bone,
    fontFamily: "Prata",
    fontSize: 19,
    textTransform: "capitalize",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  iconBox: {
    flexDirection: "row",
  },
  icon: {
    marginHorizontal: 10,
  },
});
