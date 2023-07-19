import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link, useNavigation } from "expo-router";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { Colors } from "~/constants/colors";
import Input from "../../components/HOC/Input";
import Load from "../../components/HOC/Load";
import { authenticate } from "../../../../../packages/store/auth";
import FirebaseAuthSvc from "../../../../../packages/firebase/FirebaseAuth";
import {  useAppDispatch } from '../hooks/hooks'
import { fbApp } from "../../../../../packages/firebase/FirebaseConfig";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";





const Login = () => {
  const [Loading, setLoading] = useState(false);
  const [email, setEmail] = useState("Ryanh@hstk.com");
  const [password, setPassword] = useState("password");
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useAppDispatch();
  const nav = useNavigation();
  const auth = getAuth()

  async function logInHandler(email: string, password: string) {
    setLoading(true);
    try {
      
      await FirebaseAuthSvc.loginUser(email, password).then((cred) => {
       const  userInfo = {
          token: cred.user!.refreshToken,
          userId: cred.user!.uid,
          userName: cred.user!.displayName as string
        };

        dispatch(authenticate(userInfo));
      })
    } catch (error : any) {
    if(error)  {
 
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });}
      setLoading(false);
    }
  }

  if (Loading) {
    return <Load animating={Loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Sign In</Text>
      <View style={styles.inputContainer}>
        <Input
          label={"Email"}
          textInputConfig={{
            minLength: 7,
            placeholder: "Enter your email",
            placeholderTextColor: Colors.niceBlue,
            onChangeText: (text: string) => {
              setEmail(text);
            },
            value: email,
          }}
        />
        <Input
          label={"Password"}
          textInputConfig={{
            minLength: 6,
            placeholder: "Enter your password",
            placeholderTextColor: Colors.niceBlue,
            onChangeText: (text: string) => {
              setPassword(text);
            },
            value: password,
          }}
        />
 
          <Link href={'ResetPassword'} className="text-sm text-primary text-right">Forgot password?</Link>
 
        <Pressable onPress={() => logInHandler(email, password)}>
          <Text style={styles.btn}>LOGIN</Text>
        </Pressable>
      </View>

      <View style={styles.log}>
        <Text style={styles.log1}>Don't have an account?</Text>
        <Pressable
          onPress={() => {
            nav.navigate("SignUp");
          }}
        >
          <Text style={styles.log2}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundBlk,
  },
  headline: {
    color: Colors.bone,
    fontFamily: "Prata",
    fontSize: 25,
    margin: 40,
    marginTop: 70,
  },
  inputContainer: {
    width: "90%",
    alignSelf: "center",
    margin: 15,
  },
  log: {
    alignSelf: "center",
    flexDirection: "row",
    marginTop: "58%",
  },
  log1: {
    color: Colors.accentDark,
  },
  log2: {
    color: Colors.accentDark,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  btn: {
    color: Colors.bone,
    textAlign: "center",
    margin: 30,
    fontSize: 18,
    fontFamily: "Prata",
  },
  load: {
    justifyContent: "center",
    textAlign: "center",
    alignSelf: "center",
    fontSize: 20,
    margin: 85,
    color: Colors.niceBlue,
  },
});
