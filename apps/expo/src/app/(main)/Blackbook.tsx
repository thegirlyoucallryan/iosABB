import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { Colors } from "~/constants/colors";
import { setTricksFromBackend } from "~/store/tricks-redux";
import BlackList from "../../components/BlackList";
import EmptyMessage from "../../components/EmptyMessage";
import ListHeader from "../../components/ListHeader";

const Blackbook = ({ navigation }: any) => {
  const [tricksFromSearch, setTricksFromSearch] = useState([]);
  const isLoaded = useIsFocused();
  const dispatch = useDispatch();

  const tricks = useSelector((state: any) => state.tricks.tricks);
  const token = useSelector((state: any) => state.token.token);
  const userId = useSelector((state: any) => state.userId.userId);
  const app = useSelector((s) => s.user.apparatus)

  useEffect(() => {
    const fetchTrickData = (token: string, userId: string) => {
      const sendGetRequest = async () => {
        const response = await fetch(
          `https://aerial-blackbook-default-rtdb.firebaseio.com/users/${app}/${userId}/tricks.json?auth=${token}`,
          { method: "GET" },
        );
        if (response.ok) {
          let json = await response.json();
          const tricks = [];

          for (const key in json) {
            const trickObj = {
              id: key,
              title: json[key].trick.title,
              type: json[key].trick.type,
              image: json[key].trick.image,
              date: json[key].trick.date,
              notes: json[key].trick.notes,
              preRex: json[key].trick.preRex,
            };

            tricks.push(trickObj);
            dispatch(setTricksFromBackend(tricks));
          }
        }
        if (!response.ok) {
          throw new Error("sending data failed");
        }
      };

      try {
        sendGetRequest();
      } catch (error) {
        console.log(error);
      }
    };
    if (isLoaded) {
      fetchTrickData(token, userId);
    }
  }, [isLoaded]);

  const searchHandler = (array: []) => {
    setTricksFromSearch(array);
  };

  //if I dont back out of search bar it wont rerender list

  return (
    <View style={styles.container}>
      
      <ListHeader search={searchHandler} />

      {tricksFromSearch.length === 0 ? (
        <BlackList data={tricks} navigation={navigation} />
      ) : (
        <BlackList data={tricksFromSearch} navigation={navigation} />
      )}
      {tricks.length === 0 && (
        <>
          <EmptyMessage
            msgText={
              "Start adding to your blackbook in the 'Add' tab!"
            }
            headingText={"No tricks to display yet,"}
          />
          <Text style={styles.greeting}>Happy Silking!</Text>
        </>
      )}
    </View>
  );
};

export default Blackbook;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundBlk,
    flex: 1,
  },
  load: {
    color: Colors.primary,
    alignSelf: "center",
    marginTop: "40%",
    fontSize: 25,
    fontFamily: "Prata",
  },
  startMsg: {
    color: Colors.primaryLight,
    alignSelf: "center",
    marginTop: "30%",
    fontSize: 25,
    fontFamily: "Prata",
  },
  greeting: {
    color: Colors.primary,
    textAlign: "center",
    alignSelf: "center",
    marginHorizontal: 20,
    fontSize: 25,
    fontFamily: "Prata",
  },
});
