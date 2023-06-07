import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFonts } from "expo-font";
import { SplashScreen, useNavigation } from "expo-router";
import { Colors } from "~/constants/colors";

import { useQuery } from "react-query";
import { getPosts } from "../queries";

import { Icon } from "~/components/Icon";
import { useSelector } from "react-redux";
import { FlatList } from "react-native-gesture-handler";

// import EmptyMessage from "../components/EmptyMessage";

export default function Home() {
  const postQuery = useQuery("posts", async () => await getPosts("Silks"));
  const nav = useNavigation();
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    // Perform some sort of async data or asset fetching.
    setTimeout(() => {
      setReady(true);
    }, 1000);
  }, []);

  const [loaded] = useFonts({
    Prata: require("../../../assets/fonts/Prata-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const handleAddPost = () => {
    nav.navigate("CreatePost");
  };

  const renderFlatlist = ({ item }) => {
    return (
      <>
        {item && (
          <>
            <View key={item.id} className="my-4 ">
              <Text className="text-primaryLight text-lg font-sans px-2">
                {item.userName}
              </Text>

              <ImageBackground
                source={{ uri: item.imageUrl }}
                className="w-full h-72  justify-end "
              >
                <Text className="text-bone text-2xl font-sans bg-backgroundGr text-center ">
                  {item.name}
                </Text>
              </ImageBackground>
              <Text className="text-bone font-sans items-center px-2">
                {item.caption}
              </Text>
            </View>
            <View className="flex flex-row justify-between">
              <View className="flex flex-row">
                <Icon
                  style={{ marginHorizontal: 16 }}
                  text={""}
                  name={"heart-outline"}
                  color={Colors.primaryGreenLight}
                  size={20}
                  onPress={handleAddPost}
                />
                <Icon
                  style={{ marginHorizontal: 16 }}
                  text={""}
                  name={"comment-outline"}
                  color={Colors.primaryLight}
                  size={20}
                  onPress={handleAddPost}
                />
              </View>
              <View>
                <Icon
                  style={{ marginHorizontal: 16 }}
                  text={"Train"}
                  name={"star-shooting-outline"}
                  color={Colors.primaryLight}
                  size={20}
                  onPress={handleAddPost}
                />
              </View>
            </View>
          </>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      {!isReady && <SplashScreen />}

      <View className="flex flex-row justify-center pt-2">
        <Icon
          style={{ marginHorizontal: 16 }}
          text={"Post"}
          name={"plus-box"}
          color={Colors.primaryLight}
          size={23}
          onPress={handleAddPost}
        />
        <Icon
          style={{ marginHorizontal: 16 }}
          text={"Mail"}
          name={"bell"}
          color={Colors.primaryLight}
          size={23}
          onPress={handleAddPost}
        />
        <Icon
          style={{ marginHorizontal: 16 }}
          text={"Search"}
          name={"card-search"}
          color={Colors.primaryLight}
          size={24}
          onPress={handleAddPost}
        />
      </View>

      <View className="pb-12">
        {postQuery.isLoading && (
          <ActivityIndicator size={"large"} color={Colors.primaryGreenLight} />
        )}
        {postQuery.isSuccess && (
          <FlatList
            data={postQuery.data}
            renderItem={renderFlatlist}
            className="mb-1"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundBlk,

    flex: 1,
  },
  welcome: {
    color: Colors.bone,
    fontFamily: "Prata",
    fontSize: 22,
    textAlign: "left",
  },
});
