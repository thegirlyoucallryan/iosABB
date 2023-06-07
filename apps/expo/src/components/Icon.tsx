import { Pressable, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const Icon = ({
  name,
  color,
  size,
  onPress,
  style,
  text,
  textStyle,
}: {
  name: string;
  color: string;
  size: number;
  onPress: () => void;
  style?: any;
  text?: string;
  textStyle?: any;
}) => {
  return (
    <Pressable onPress={onPress} className="flex justify-center text-center items-center">
      <MaterialCommunityIcons
        name={name}
        color={color}
        style={{
          ...style,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 2,
        }}
        size={size}
        onPress={onPress}
      />
      {text ? (
        <Text
          style={{
            ...textStyle,
            color: color,
            fontWeight: "200",
            letterSpacing: 0.8,
            alignSelf: "center",
          }}
        >
          {text}
        </Text>
      ) : null}
    </Pressable>
  );
};
