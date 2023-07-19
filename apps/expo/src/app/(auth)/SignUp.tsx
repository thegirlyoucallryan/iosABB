import { useState } from "react"
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native"
import { useDispatch } from "react-redux"
import { Colors } from "~/constants/colors"
import { authenticate } from "../../../../../packages/store/auth"
import Input from "../../components/HOC/Input"
import Load from "../../components/HOC/Load"
import FirebaseAuthSvc from "../../../../../packages/firebase/FirebaseAuth"
import FbFirestoreService, {
    firestore,
} from "../../../../../packages/firebase/FirebaseCloudService"
import { Link, useNavigation } from "expo-router"
import Toast from "react-native-toast-message"


const SignUp = () => {
    const nav = useNavigation()
    const [name, setName] = useState({ name: "", isValid: true })
    const [email, setEmail] = useState({
        email: "email@gmail.com",
        isValid: true,
    })
    const [password, setPassword] = useState({
        password: "password",
        isValid: true,
    })
    const [confirmP, setConfirmP] = useState({
        confirmP: "password",
        isValid: true,
    })
       const [Loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    async function signUpHandler(email: string, password: string) {
           try {
            const nameRef = firestore
                .collection("users")
                .where("info.userName", "==", name.name)
            nameRef.get().then((snapshot) => {
             
                if (snapshot.empty) {
                    setLoading(true)
                    FirebaseAuthSvc.registerUser(email, password)
                        .then((Credential) => {
                            FbFirestoreService.createDocumentWithUId(
                                "users",
                                Credential?.user!.uid,
                                {
                                    userName: name.name,
                                    token: Credential.user?.refreshToken,
                                    userId: Credential.user?.uid,
                                    email: Credential.user?.email,
                                    following: [],
                                }
                            )
                            return Credential
                        })
                        .then((Credential) => {
                            FirebaseAuthSvc.updateUser(name.name)

                            dispatch(
                                authenticate({
                                    token: Credential.user!.refreshToken,
                                    userId: Credential.user!.uid,
                                    userName:
                                        name.name.charAt(0).toUpperCase() +
                                        name.name.slice(1),
                                })
                            )
                        })
                        .then(() => {
                            setConfirmP({ confirmP: "", isValid: true })
                            setName({ name: "", isValid: true })
                            setEmail({ email: "", isValid: true })
                            setPassword({ password: "", isValid: true })
                        })
                }
                if (!snapshot.empty) {
                  Toast.show({
                    type: "error",
                    text1: "User name exists",
                    text2: 'Sorry, this username is taken, please choose another one.',
                })
                    setName({ isValid: true, name: "" })
                }
            })
        } catch (error: any) {
            console.log(error, "errormesg")
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message,
            })
            setLoading(false)
        }
    }

    if (Loading) {
        return <Load animating={Loading} />
    }

    function validationHandler() {
        const nameIsValid = name.name.length > 6
        const passwordIsValid = password.password.length >= 6
        const emailIsValid = email.email.length > 6 && email.email.includes("@")
        const confirmPIsValid = password.password === confirmP.confirmP

        if (!nameIsValid || !passwordIsValid || !emailIsValid || !confirmP) {
            setName((current) => {
                return {
                    name: current.name,
                    isValid: nameIsValid,
                }
            })
            setPassword((current) => {
                return {
                    password: current.password,
                    isValid: passwordIsValid,
                }
            })
            setEmail((current) => {
                return {
                    email: current.email,
                    isValid: emailIsValid,
                }
            })
            setConfirmP((current) => {
                return {
                    confirmP: current.confirmP,
                    isValid: confirmPIsValid,
                }
            })
            return
        }

        signUpHandler(email.email, password.password)
    }

    return (
        <>
            <ScrollView style={styles.container}>
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
                                    name:
                                        text.toLowerCase(),
                                    isValid: true,
                                }),
                        }}
                    />
                    {!name.isValid && (
                        <Text style={styles.invalid}>
                            {" "}
                            Please enter a valid name.
                        </Text>
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
                        <Text style={styles.invalid}>
                            {" "}
                            Please enter a valid email.
                        </Text>
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
                        <Text style={styles.invalid}>
                            Passwords don't match.
                        </Text>
                    )}
                    <View style={styles.log} className="w-26 flex-col flex">
                        <Text style={styles.log1}>
                            In order to proceed please first agree to our
                        </Text>

                        <Link
                            href={
                                "https://app.termly.io/dashboard/website/a2f4ff45-e04f-40c1-8701-02e7215dcf55/terms-of-service"
                            }
                            className="text-sm text-primary text-right"
                        >
                            Terms & Conditions
                        </Link>
                    </View>
                    <Pressable onPress={validationHandler}>
                        <Text style={styles.btn}>REGISTER</Text>
                    </Pressable>
                </View>
                <View style={styles.log} className="flex flex-row">
                    <Text style={styles.log1}>Have an account?</Text>
                    <Pressable
                        onPress={() => {
                            nav.navigate("Login")
                        }}
                    >
                        <Text style={styles.log2} className="mx-2">
                            Sign in
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </>
    )
}

export default SignUp

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
        alignItems: "center",
        // flexDirection: "row",
        marginTop: "5%",
        maxWidth: 300,
    },
    log1: {
        color: Colors.accentDark,
    },
    log2: {
        color: Colors.accentDark,
        fontWeight: "bold",
        fontSize: 17,
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
})
