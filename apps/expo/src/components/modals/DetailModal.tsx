import { Alert, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "expo-router";
import { useDispatch } from "react-redux";

import { Colors } from "~/constants/colors";
import { deleteFromAll, toggleFavorites } from "~/store/tricks-redux";
import { Trick, Type } from "~/types";
import { Icon } from "../../components/Icon";
import WithModal from "../../components/withModal";

export const DetailModal = ({
  close,
  trick,
  favorites,
}: {
  close: () => void;
  trick: Trick;
  favorites: Trick[];
}) => {
  const { title, notes, id, preReqs, type } = trick;
  const dispatch = useDispatch();
  const nav = useNavigation();
  const toggleFavoritesHandler = (title: string, id: string, type: Type) => {
    dispatch(
      toggleFavorites({
        title,
        id,
        type,
        isComplete: false,
      }),
    );
  };

  function deleteHandler(id: string) {
    Alert.alert(
      "Delete?",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Yes, Delete",
          onPress: () => {
            nav.navigate({ name: "Blackbook" });
            dispatch(deleteFromAll(id, token, uId));
          },
        },
        { text: "Cancel" },
      ],
      { cancelable: true },
    );
  }

  return (
    <WithModal close={close} marginTop={"60%"}>
      <View>
        <View style={styles.iconContainer}>
          <Icon
            name={
              favorites.find((favorite) => favorite.id === id)
                ? "star-shooting"
                : "star-shooting-outline"
            }
            color={Colors.primaryLight}
            size={27}
            text={"Train"}
            textStyle={{ fontSize: 10 }}
            onPress={() => {
              toggleFavoritesHandler(title, id, type);
            }}
          />
          <Icon
            name={"instagram"}
            color={Colors.accentLight}
            size={27}
            text={"Share"}
            textStyle={{ fontSize: 10 }}
            onPress={() => {}}
          />
          <Icon
            name={"trash-can"}
            color={Colors.accentDark}
            size={27}
            text={"Delete"}
            textStyle={{ fontSize: 10 }}
            onPress={() => deleteHandler(id)}
          />
          <Icon
            name={"pencil"}
            color={Colors.bone}
            size={27}
            text={"Edit"}
            textStyle={{ fontSize: 10 }}
            onPress={() => {
              close();
              nav.navigate("AddTrick", {
                isEditing: true,
                trick,
              });
            }}
          />
        </View>
        <Text style={{ ...styles.label, marginBottom: 5 }}>{title}</Text>
        <Text style={styles.text}>{type}</Text>
        {/* <Text style={styles.text}>Added: {createdAt.slice(4)}</Text> */}
        {!notes && !preReqs && (
          <Text style={styles.error}>
            No additional information was entered.
          </Text>
        )}
        {notes ? (
          <View style={styles.info}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.text}>{notes}</Text>
          </View>
        ) : null}
        {preReqs ? (
          <View style={styles.info}>
            <Text style={styles.label}>Prerequisites</Text>
            <Text style={styles.text}>{preReqs}</Text>
          </View>
        ) : null}
      </View>
    </WithModal>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 19,
    fontFamily: "Prata",
    color: Colors.primary,
    textTransform: "capitalize",
  },
  info: {
    justifyContent: "space-between",
    marginHorizontal: 8,

    padding: 5,
  },
  text: {
    fontSize: 13,
    textTransform: "capitalize",
    marginBottom: 10,
    color: Colors.bone,
    fontWeight: "300",
    letterSpacing: 1,
  },
  error: {
    textAlign: "center",
    fontSize: 16,
    padding: 25,
    color: Colors.bone,
    fontWeight: "300",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomColor: Colors.bone,
    borderBottomWidth: 0.5,
  },
  cancel: {
    color: Colors.accentDark,
  },
});
