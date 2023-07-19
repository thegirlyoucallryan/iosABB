import { View, Text, ActivityIndicator } from "react-native";
import WithModal from "../withModal";
import Input from "../HOC/Input";
import { useAppSelector } from "~/app/hooks/hooks";
import { Colors } from "~/constants/colors";
import { useState } from "react";
import { AccentBtn } from "../HOC/Button";
import {
  firestore,
} from "../../../../../packages/firebase/FirebaseCloudService";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { arrayUnion } from "firebase/firestore";
import {  useQuery, useQueryClient } from "react-query";
import { getComments } from "~/app/queries";
import { ScrollView } from "react-native-gesture-handler";
import 'react-native-get-random-values';
import uuid from "react-native-uuid";
export default function CommentsModal({
  close,
  caption,
  userName,
  docId,
}: {
  close: () => void;
  caption: string;
  userName: string;
  docId: string;
}) {
  const [comment, setComment] = useState<{
    id:string,
    currentUser: string;
    commentText: string;
  }>();
  const apparatus = useAppSelector((s) => s.user.apparatus);
  const currentUser = useAppSelector((s) => s.isAuthenticated.userName);
  const queryClient = useQueryClient();
  const allComments = useQuery(
    "comments",
    async () => await getComments(docId, apparatus)
  );
  console.log(allComments, "allcomments");

  const handleComment = async () => {
    let commentRef = firestore.collection(apparatus!).doc(docId);
    if (comment) {
      try {
        await commentRef
          .update({
            comments: arrayUnion(comment),
          })
          .then(() => queryClient.refetchQueries("comments"))
          .then(() => setComment({id: '', currentUser: '', commentText: ''}))
      } catch (error: any) {
        console.log(error.message);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message,
        });
      }
    }
  };
  return (
    <WithModal close={close} marginTop={"10%"}>
       <Text className="text-primary text-lg text-center mb-2 font-sans">Comments</Text>
     <ScrollView contentContainerStyle={{display: 'flex', flexGrow: 1, paddingBottom: 4}}>
     
      <View className="flex flex-grow">
       <View className="flex flex-row items center">
       <Text className="text-bone  font-sans   mr-2">{userName}</Text>
        <Text className="text-accentDark font-sans mb-2">{caption}</Text>
       </View>
      {allComments.isLoading && <ActivityIndicator color={Colors.accentLight} />}
      {allComments.data &&
        allComments.data.map((item) => (
          <View key={item.id} className="flex flex-row items-center mb-1">
            <Text className="text-bone  font-sans text-sm mr-2">{item.currentUser}</Text>
            <Text className="text-accentDark  ">{item.commentText}</Text>
          </View>
        ))}
           </View>
      
     </ScrollView>
     <View className="flex place-self-end flex-col">
        <Input
         
          textInputConfig={{
            placeholder: "Add a comment",
            onChangeText: (text: string) =>
              setComment({id: uuid.v4().toString(),  currentUser: currentUser, commentText: text }),
            placeholderTextColor: Colors.niceBlue,
            autoCapitalize: "words",
            value: comment?.commentText,
        
          }}
       
        />
         {comment && (
        <View className="flex items-center">
          <AccentBtn text={"Post"} onPress={() => handleComment()} />
        </View>
      )}
      </View>
     
    </WithModal>
  );
}
