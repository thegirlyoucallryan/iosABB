import {
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";

import { Colors } from "~/constants/colors";

import logo from '../../assets/logo.png'

import { AccentBtn } from "../components/HOC/Button";

let width = Dimensions.get("window").width;

export default function Welcome() {
  const router = useRouter()
  const nav = useNavigation();
  return (
    <View style={styles.container}>
      <View style={{height: 390}}>
    <View style={{height: 350}}>
    <Image source={logo} style={styles.image} />
    </View>
    </View>
      
      <Text style={styles.welcome}>Welcome</Text>
      <Text style={styles.headline}>
        Aerial Admin, An app built for Aerialists.
      </Text>

      <View style={styles.buttonBox}>
        <AccentBtn
          onPress={() => {
            router.push("/(auth)/Login");
          }}
          text={"Login   ->"}
        />
        <View style={styles.signup}>
          <Text style={styles.headline}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              router.push("/(auth)/SignUp");
            }}
          >
            <Text style={styles.signup}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundBlk,
    justifyContent: "center",
    padding: 30,
  },

  welcome: {
    color: Colors.accentLight,
    textAlign: "center",
    fontSize: 36,
    margin: 5,
    fontFamily: "Prata",
  },
  headline: {
    color: Colors.bone,
    margin: 10,
    marginBottom: 35,
    alignSelf: "center",
    textAlign: "center",
  },
  signup: {
    color: Colors.bone,
    fontWeight: "bold",
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  buttonBox: {
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center",
  },
  image: {
    width: '100%',
    height: '100%',
    alignSelf: "center",
  },
});
