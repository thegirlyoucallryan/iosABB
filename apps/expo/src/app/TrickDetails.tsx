import { useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { useSearchParams } from "expo-router";
import { useSelector } from "react-redux";

import { Colors } from "~/constants/colors";
import { Icon } from "../components/Icon";
import { DetailModal } from "../components/modals/DetailModal";

const TrickDetails = () => {
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const tricks = useSelector((state) => state.tricks.tricks);
  const favorites = useSelector((state) => state.favorites.favorites);
  const { data: title } = useSearchParams();

  let selectedTrick = tricks.find((item) => item.title === title);
  console.log(selectedTrick, 'selected')
  const closeModalHandler = () => {
    setOpenInfoModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text numberOfLines={2} style={styles.name}>
          {selectedTrick?.title}
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
     <ImageBackground
        source={{ uri: selectedTrick?.image }}
        style={{ height: '100%', width: "100%", marginHorizontal: 3 }}
      />
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
        {openInfoModal && (
          <DetailModal
            close={closeModalHandler}
            trick={selectedTrick}
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
