import { useState } from "react";
import { View, Text, Pressable } from "react-native"
import Input from "~/components/HOC/Input";
import { ScreenWrapper } from "~/components/ui/ScreenWrapper"
import { Colors } from "~/constants/colors";
import FirebaseAuthSvc from "../../../../../packages/firebase/FirebaseAuth";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

const ResetPassword = () => {
    const [email, setEmail] = useState("Ryanh@hstks.com");
    const router = useRouter()

    const resetHandler = async() => {
        if(email == null){
            Toast.show({type: 'error', text1: 'Error', text2: 'Please enter a valid email'})
        }
      await FirebaseAuthSvc.sendPasswordResetEmail(email).then(() => {
        Toast.show({type: 'success', text1: 'Success', text2: 'Please check your email to reset your password'})
      }).then(()=> router.replace('Login'))
    }
  return ( 
    <ScreenWrapper>
       <View className="justify-center px-6">
       <Text className="text-bone font-sans text-2xl mt-16 mb-10">Reset your password</Text>
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
        <Pressable onPress={() => {resetHandler()}}>
          <Text className="text-center text-bone font-sans text-lg m-8">SEND</Text>
        </Pressable>
       </View>
    </ScreenWrapper>
      
  
  )
}

export default ResetPassword