import { useState } from "react";
import { ImageBackground, ImageSourcePropType, Linking, StyleSheet, Text, View } from "react-native";
import { useSearchParams } from "expo-router";
import { Colors } from "~/constants/colors";
import { Icon } from "../components/Icon";
import { DetailModal } from "../components/modals/DetailModal";
import { useAppSelector } from "./hooks/hooks";
import { Trick } from "../../../../packages/store/tricks-redux";
import { Video, ResizeMode, AVPlaybackStatusSuccess } from "expo-av";
import { useRef } from "react";
import { useGetFetchQuery } from "./hooks/useQueryClient";

const TrickDetails = () => {
  const [openInfoModal, setOpenInfoModal] = useState(true);
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const {id} = useSearchParams()
  const data = useGetFetchQuery('tricks') as Trick[]
  const trick = data.find(d => d.id === id)
  const video = useRef(null);
  const [status, setStatus] = useState<AVPlaybackStatusSuccess | {}>({});

  const closeModalHandler = () => {
    setOpenInfoModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text numberOfLines={2} style={styles.name}>
          {trick?.title}
        </Text>
        <Icon
          style={styles.editImageDots}
          name="dots-vertical"
          color={Colors.bone}
          size={25}
          onPress={() => {
            setOpenInfoModal(true);
          }}
        />
      </View>
      <View className="w-full h-72">
        {trick?.image.type === 'image' && (
          <ImageBackground
            source={{ uri: trick?.image.url}}
            style={{ height: "100%", width: "100%", marginHorizontal: 3 }}
          />
        )}
         {trick?.image.type === 'video' && (
          <Video
          ref={video}
          style={{ width: "100%", height: "100%",  }}
          source={{
            uri: trick.image.url
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Icon
          style={{ alignSelf: "center" }}
          name="chevron-up-box"
          color={Colors.primaryLight}
          size={23}
          text="See info"
          textStyle={styles.text}
          onPress={() => {
            setOpenInfoModal(true);
          }}
        />
        {openInfoModal && trick && (
          <DetailModal
            close={closeModalHandler}
            trick={trick}
            favorites={favorites}
          />
        )}
      </View>
    </View>
  );
};

export default TrickDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundBlk,
  },
  name: {
    color: Colors.primary,
    textAlign: "center",
    fontFamily: "Prata",
    fontSize: 22,
    textTransform: "capitalize",
    paddingVertical: 10,
    letterSpacing: 1,
    maxWidth: 250,
  },

  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 12,
    fontFamily: "Prata",
    color: Colors.primaryLight,
  },
  infoContainer: {
    flexDirection: "column",
    padding: 10,
    width: "100%",
    marginTop: 8,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginHorizontal: 19,
    alignItems: "center",
  },
  type: {
    color: Colors.bone,
    fontSize: 12,
    marginBottom: 6,
  },
  date: {
    color: "rgba(242,242,242, .7)",
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Prata",
    margin: 12,
    marginTop: "95%",
  },
  editImageDots: {
    alignSelf: "flex-end",
    margin: 10,
  },
});
