import { FlatList, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import { Colors } from "~/constants/colors";

import { toggleFavorites } from "../store/tricks-redux";
import { Icon } from "./Icon";
import { Type } from ".prisma/client";

const BlackList = ({ data }: any) => {
  const dispatch = useDispatch();

  const favorites = useSelector((state) => state.favorites.favorites);

  const toggleFavoritesHandler = (
    title: string,
    id: string,
    type: Type,
    isFavorite: boolean,
  ) => {
    dispatch(
      toggleFavorites({
        title,
        id,
        type,
        isFavorite,
        isComplete: false,
      }),
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={true}
        data={data}
        keyExtractor={(data) => data.title}
        extraData={data}
        renderItem={({ item }) => (
          <View style={styles.blackList}>
            <View>
              <Link
                style={styles.name}
                href={{
                  pathname: "/TrickDetails",
                  params: {
                    data: item.title,
                  },
                }}
              >
                {item?.title}
              </Link>
              <Text style={styles.type}>{item.type}</Text>
            </View>
            <Icon
              name={
                favorites.find((favorite: any) => favorite.id === item.id)
                  ? "star-shooting"
                  : "star-shooting-outline"
              }
              color={Colors.accentLight}
              size={25}
              text={"Train"}
              textStyle={styles.iconLabel}
              onPress={() => {
                toggleFavoritesHandler(
                  item.title,
                  item.id,
                  item.type,
                  item.isFavorite,
                );
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

export default BlackList;

const styles = StyleSheet.create({
  container: {
    marginBottom: 2,
  },
  blackList: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    padding: 11,
    paddingHorizontal: 35,
    borderRadius: 10,
  },
  name: {
    color: Colors.primaryLight,
    fontSize: 17,
    textTransform: "capitalize",
    fontFamily: "Prata",
    maxWidth: 280,
  },
  type: {
    fontSize: 13,
    color: Colors.accentLight,
    textTransform: "capitalize",
    marginHorizontal: 1,
    fontWeight: "300",
  },
  startMsg: {
    color: Colors.accentDark,
    textAlign: "center",
    alignSelf: "center",
    marginTop: "30%",
    marginHorizontal: 20,
    fontSize: 25,
    fontFamily: "Prata",
  },
  iconLabel: {
    fontSize: 9,
    color: Colors.primaryLight,
  },
});
