import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  Platform,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import z from "zod";
import { Colors } from "~/constants/colors";
import { authenticate } from "~/store/auth";
import Input from "../../components/HOC/Input";
import Load from "../../components/HOC/Load";
import FirebaseAuthSvc from "../../../../../packages/firebase/FirebaseAuth";
import FbFirestoreService from "../../../../../packages/firebase/FirebaseCloudService";
import { useNavigation } from "expo-router";

const SignUp = () => {
  const nav = useNavigation();
  const [name, setName] = useState({ name: "", isValid: true });
  const [email, setEmail] = useState({ email: "", isValid: true });
  const [password, setPassword] = useState({ password: "", isValid: true });
  const [confirmP, setConfirmP] = useState({ confirmP: "", isValid: true });
  const [userInfo, setUserInfo] = useState({});
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  async function signUpHandler(email: string, password: string) {
    setLoading(true);
    try {
      await FirebaseAuthSvc.registerUser(email, password)
        .then((Credential) => {
          FbFirestoreService.createDocumentWithUId(
            "users",
            Credential.user.uid,
            {
              userName: name.name,
              token: Credential.user.refreshToken,
              userId: Credential.user.uid,
            }
          );
          return Credential;
        })
        .then((Credential) => {
          console.log(Credential, "cred");
          FirebaseAuthSvc.updateUser(name.name);

          console.log(Credential, "fucking user info");
          dispatch(
            authenticate({
              token: Credential.user.refreshToken,
              userId: Credential.user.uid,
              userName: name.name,
            })
          );
        });
    } catch (errorMessage) {
      console.log(errorMessage, "errormesg");
      setLoading(false);
    } finally {
    }
  }

  if (Loading) {
    return <Load animating={Loading} />;
  }

  function validationHandler() {
    const nameIsValid = name.name.length > 6;
    const passwordIsValid = password.password.length >= 6;
    const emailIsValid = email.email.length > 6 && email.email.includes("@");
    const confirmPIsValid = password.password === confirmP.confirmP;

    if (!nameIsValid || !passwordIsValid || !emailIsValid || !confirmP) {
      setName((current) => {
        return {
          name: current.name,
          isValid: nameIsValid,
        };
      });
      setPassword((current) => {
        return {
          password: current.password,
          isValid: passwordIsValid,
        };
      });
      setEmail((current) => {
        return {
          email: current.email,
          isValid: emailIsValid,
        };
      });
      setConfirmP((current) => {
        return {
          confirmP: current.confirmP,
          isValid: confirmPIsValid,
        };
      });
      return;
    }

    signUpHandler(email.email, password.password);
    setConfirmP({ confirmP: "", isValid: true });
    setName({ name: "", isValid: true });
    setEmail({ email: "", isValid: true });
    setPassword({ password: "", isValid: true });
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.headline}>Sign Up</Text>
        <View style={styles.inputContainer}>
          <Input
            label={"User Name"}
            textInputConfig={{
              autoFocus: true,
              minLength: 4,
              placeholder: "Create a user name",
              placeholderTextColor: Colors.niceBlue,
              value: name.name,
              inValid: { name: name.isValid },
              onChangeText: (text: string) =>
                setName({
                  name: text.charAt(0).toUpperCase() + text.slice(1),
                  isValid: true,
                }),
            }}
          />
          {!name.isValid && (
            <Text style={styles.invalid}> Please enter a valid name.</Text>
          )}

          <Input
            label={"Email"}
            textInputConfig={{
              minLength: 7,
              placeholder: "Enter your email",
              placeholderTextColor: Colors.niceBlue,
              onChangeText: (text: string) =>
                setEmail({ email: text, isValid: true }),
              value: email.email,
              inValid: { email: email.isValid },
            }}
          />
          {!email.isValid && (
            <Text style={styles.invalid}> Please enter a valid email.</Text>
          )}
          <Input
            label={"Password"}
            textInputConfig={{
              minLength: 6,
              placeholder: "Enter your password",
              placeholderTextColor: Colors.niceBlue,
              onChangeText: (text: string) =>
                setPassword({ password: text, isValid: true }),
              value: password.password,
              inValid: { password: password.isValid },
            }}
          />
          {!password.isValid && (
            <Text style={styles.invalid}>
              Password should be at least 6 characters.
            </Text>
          )}
          <Input
            label={"Confirm Password"}
            textInputConfig={{
              minLength: 6,
              placeholder: "Confirm",
              placeholderTextColor: Colors.niceBlue,
              onChangeText: (text: string) =>
                setConfirmP({ confirmP: text, isValid: true }),
              value: confirmP.confirmP,
              inValid: { confirmP: confirmP.isValid },
            }}
          />
          {!confirmP.isValid && (
            <Text style={styles.invalid}>Passwords don't match.</Text>
          )}
          <Pressable onPress={validationHandler}>
            <Text style={styles.btn}>REGISTER</Text>
          </Pressable>
        </View>
        <View style={styles.log}>
          <Text style={styles.log1}>Have an account?</Text>
          <Pressable
            onPress={() => {
              nav.navigate("Login");
            }}
          >
            <Text style={styles.log2}>Sign in</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default SignUp;

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
    marginTop: "25%",
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
  invalid: {
    color: Colors.accentLight,
    marginHorizontal: 30,
    fontSize: 13,
  },
});
