import { StyleSheet, Text, TextInput, View } from "react-native";

import { Colors } from "~/constants/colors";
import { Icon } from "../Icon";

export default function Input({
  label,
  textInputConfig,
  
}: {
  label?: string;
  textInputConfig: any;
}) {
  const labelStyle = () => {
    let labelStyles;
    if (label == null) {
      labelStyles = {
        height: 0,
      };
    } else {
      labelStyles = {
        color: Colors.bone,
        fontSize: 17,
        marginBottom: 5,
        fontFamily: "Prata",
      };
    }
    return labelStyles;
  };
  return (
    <View>
      <Text style={labelStyle()}>{label}</Text>
      <TextInput style={styles.input} {...textInputConfig}
      placeholderTextColor={Colors.niceBlue}
      returnKeyType='done'>
        {textInputConfig.icon && (
          <View className="absolute right-0 z-10">
            <Icon
              name={textInputConfig.iconName}
              size={20}
              color={Colors.backgroundGr}
              onPress={textInputConfig.iconOnPress}
            />
          </View>
        )}
      </TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.backgroundBlk,
    borderRadius: 8,
    padding: 12,
    elevation: 5,
    color: Colors.primaryLight,
    marginBottom: 10,
    
    fontSize: 15,
  },
});
