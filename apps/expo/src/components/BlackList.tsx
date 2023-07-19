import { FlatList, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { useDispatch,  } from "react-redux";
import { Colors } from "~/constants/colors";
import { Trick, toggleFavorites } from "../../../../packages/store/tricks-redux";
import { Icon } from "./Icon";
import { TrickType } from "../../../../packages/store/tricks-redux";
import { useAppSelector } from "~/app/hooks/hooks";

const BlackList = ( {data}: {data: Trick[]} ) => {
  const dispatch = useDispatch();

  const favorites = useAppSelector((state) => state.favorites.favorites);
  
  const toggleFavoritesHandler = (
    title: string,
    id: string,
    type: TrickType,
    isFavorite: boolean,
    image: {url: string, type: string},
    tally: number,
    
  ) => {
    dispatch(
      toggleFavorites({
        title,
        id,
        type,
        isFavorite,
        completed: false,
        image,
        tally,
       
      }),
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{flexGrow: 1, marginBottom: 10 }}
        scrollEnabled={true}
        data={data}
        keyExtractor={(data) => data.id}
        extraData={data}
        renderItem={({ item }) => (
          
          <View style={styles.blackList}>
            <View>
              <Link
                style={styles.name}
                href={{
                  pathname: "/TrickDetails",
                  params: {
                  id: item.id
                  },
                }}
              >
                {item?.title.length < 50 ? item?.title : item?.title.substring(0,50) + '...'}
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
                  item.isFavorite ? item.isFavorite : item.isFavorite = false,
                  item.image,
                  item.tally,
                  
                 
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
    marginBottom: 20,
    height: '90%'
  },
  blackList: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 5,
    padding: 7,
    paddingHorizontal: 35,
    borderRadius: 10,
  },
  name: {
    color: Colors.primaryLight,
    fontSize: 14,
    textTransform: "capitalize",
    fontFamily: "Prata",
    maxWidth: 270,
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
