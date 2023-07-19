import { Text, StyleSheet, View, Pressable, ScrollView } from "react-native";
import { PrimaryBtn } from "~/components/HOC/Button";
import ImageSelector from "~/components/ImageSelector";
import { Colors } from "~/constants/colors";
import Input from "~/components/HOC/Input";
import FbFirestoreService, { firestore } from "../../../../packages/firebase/FirebaseCloudService";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigation } from "expo-router";
import { getAuth } from "firebase/auth";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { ImageType } from "~/components/AddForm";
import { useAppSelector } from "./hooks/hooks";
import uuid from "react-native-uuid";
import {  Timestamp } from "firebase/firestore";

const CreatePost = () => {
  const nav = useNavigation();
  // const [name, setName] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [image, setImage] = useState<ImageType>({ url: "", type: "" });

  useEffect(() => {
    nav.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: Colors.backgroundBlk,
      },
      headerTitleStyle: { color: Colors.primaryLight, fontFamily: "Prata" },
      headerTintColor: Colors.primaryGreen,
      headerTitle: "Create a post",
    });
  }, []);

  const apparatus = useAppSelector((state) => state.user.apparatus);

  const auth = getAuth();

  const queryClient = useQueryClient();

  const imageHandler = (image: ImageType) => {
    setImage({ url: image!.url, type: image!.type });
  };

  async function handleCreatePost({
    // name,
    caption,
  }: {
    // name: string;
    caption: string;
  }) {
    const user = auth.currentUser;

    if (!caption || !image?.url) {
      Toast.show({
        type: "error",
        text1: "Woops!",
        text2: "More information required",
      });
      return;
    }

    const uid = uuid.v4().toString()

    const newPost = {
      createdAt: Timestamp.now(),
      id: uid,
      user: user!.displayName as string,
      caption,
      image: { url: image.url, type: image.type },
      likes: [],
      comments: [],
      setToTrain: [],
      isSetToTrainByUser: [],
      isLikedByUser: false,
    };


   
    try {
      await FbFirestoreService.createDocument(`${apparatus}`, newPost, uid).then(() => {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "post successfully created",
        });
      });
    } catch (errorText: any) {
      Toast.show({
        type: "error",
        text1: "Something went wrong, please try again",
        text2: errorText?.message,
      });
    } finally {
      queryClient

        .refetchQueries(["posts"])
        .then(() => queryClient.invalidateQueries(["posts"]))
        .then(() => nav.navigate("Home"));
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "center",

        marginTop: 50,
      }}
      style={styles.container}
    >
      <Text style={styles.add}>Create Post</Text>
      <View style={styles.form}>
        {/* <Input
          label="Name"
          textInputConfig={{
            autoFocus: true,
            minLength: 1,
            placeholder: "enter a name",
            iconName: "numeric",
            value: name,
            placeholderTextColor: Colors.niceBlue,
            onChangeText: (text: string) => {
              setName(text.charAt(0).toUpperCase() + text.slice(1));
            },
          }}
        /> */}

        <View className="w-full rounded-sm ">
          <ImageSelector onTakeImage={imageHandler} basePath="Posts" />
        </View>
        <Input
          label="Caption"
          textInputConfig={{
            autoFocus: true,
            minLength: 1,
            placeholder: "enter a caption",
            iconName: "numeric",
            value: caption,
            placeholderTextColor: Colors.niceBlue,
            onChangeText: (text: string) => {
              setCaption(text.charAt(0).toUpperCase() + text.slice(1));
            },
          }}
        />
        <View style={{ width: "60%", alignSelf: "center", margin: 12 }}>
          <PrimaryBtn
            text="Post"
            onPress={() => {
              handleCreatePost({ caption });
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundBlk,
    flex: 1,
  },
  add: {
    color: Colors.bone,
    fontFamily: "Prata",
    fontSize: 20,
    paddingTop: 15,
    marginLeft: 10,
  },
  form: {
    marginTop: 20,
    backgroundColor: Colors.backgroundGr,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 25,
    padding: 10,
  },
  rowText: {
    backgroundColor: Colors.backgroundBlk,
    color: Colors.primaryLight,
    fontFamily: "Prata",
    fontSize: 14,
    borderBottomColor: "transparent",
  },

  errorText: {
    textAlign: "left",
    marginTop: 1,
    color: Colors.primaryGreenLight,
    fontSize: 11,
  },
  nextNumberContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

// Error: Problem validating asset fields in app.json. Learn more: https://docs.expo.dev/
//  • Field: android.adaptiveIcon.foregroundImage - image should be square, but the file at './assets/icon.png' has dimensions 870x1179.
//  • Field: icon - image should be square, but the file at './assets/icon.png' has dimensions 870x1179.
