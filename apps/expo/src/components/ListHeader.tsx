import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "expo-router";
import { useSelector } from "react-redux";

import { Colors } from "~/constants/colors";
import SearchBar from "../components/SearchBar";
import { Icon } from "./Icon";

const ListHeader = ({ search }: { search: any }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const nav = useNavigation();
  const tricks = useSelector((state: any) => state.tricks.tricks);

  //filter returns true!!

  useEffect(() => {
    const trickFilter = tricks.filter(function (item: any) {
      if (
        item.title.toLowerCase().includes(searchQuery) ||
        item.type.toLowerCase().includes(searchQuery)
      )
        return true;
    });
    search(trickFilter);
  }, [searchQuery]);

  const queryHandler = (query: string) => {
    let lowercasequery = query.toLowerCase();
    setSearchQuery(lowercasequery);
  };

  return (
    <View>
      {!showSearch ? (
        <View style={styles.optionContainer}>
          <View style={styles.headerView}>
            <Icon
              name="plus-box"
              color={Colors.primaryLight}
              size={27}
              text={"Add"}
              onPress={() =>
                nav.navigate("AddTrick", {
                  screen: "Train",
                  initial: false,
                })
              }
            />
          </View>
          <View style={styles.headerView}>
            <Icon
              name={"card-search"}
              color={Colors.bone}
              size={27}
              text={"Search"}
              onPress={() => {
                setShowSearch(true);
              }}
            />
          </View>
        </View>
      ) : (
        <View style={styles.seachContainer}>
          <SearchBar stateHandler={queryHandler} />
          <Icon
            style={styles.close}
            name={"close"}
            color={Colors.bone}
            size={27}
            text="Close"
            textStyle={{ fontSize: 10 }}
            onPress={() => setShowSearch(false)}
          />
        </View>
      )}
    </View>
  );
};

export default ListHeader;

const styles = StyleSheet.create({
  headerView: {
    justifyContent: "center",
    padding: 5,
    width: "50%",
    alignItems: "center",
    height: "100%",
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 75,
    backgroundColor: Colors.backgroundGr,
    borderBottomWidth: 0.5,
  },
  seachContainer: {
    backgroundColor: Colors.backgroundGr,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 15,
    height: 75,
    borderTopWidth: 0.8,
    paddingLeft: 20,
  },
  close: {
    backgroundColor: Colors.primary,
    borderRadius: 4,

    marginTop: -10,
  },
});
