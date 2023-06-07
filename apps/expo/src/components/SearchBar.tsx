import { StyleSheet, View } from "react-native";

import Input from "~/components/HOC/Input";
import { Colors } from "~/constants/colors";

const SearchBar = ({
  stateHandler,
}: {
  stateHandler: (text: string) => void;
}) => {
  return (
    <View style={styles.inputView}>
      <Input
        textInputConfig={{
          minLength: 1,
          placeholder: 'Search by "name" or "type"',
          placeholderTextColor: Colors.primaryLight,
          onChangeText: (text: string) => {
            stateHandler(text);
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputView: {
    width: "80%",
    marginBottom: 20,
    marginRight: 10,
  },
});
export default SearchBar;
