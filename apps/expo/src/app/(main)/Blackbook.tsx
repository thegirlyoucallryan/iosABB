import {  useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors } from "~/constants/colors";
import { Trick} from "../../../../../packages/store/tricks-redux";
import BlackList from "../../components/BlackList";
import EmptyMessage from "../../components/EmptyMessage";
import ListHeader from "../../components/ListHeader";
import { useAppSelector } from "../hooks/hooks";
import { useQuery } from "react-query";
import { getTricks } from "../queries";

const Blackbook = () => {
  const [tricksFromSearch, setTricksFromSearch] = useState<Trick[]>();
  const apparatus = useAppSelector((s) => s.user.apparatus)
  const userId = useAppSelector((state: any) => state.userId.userId);
  const {isSuccess, data, isLoading} = useQuery<Trick[]>('tricks', async() => await getTricks(userId, apparatus!))
  
  const searchHandler = (trick: Trick[]) => {
    setTricksFromSearch(trick);
  };

  return (
    <View style={styles.container}>
       <ListHeader search={searchHandler} data={data} />
         {isSuccess && !tricksFromSearch && <BlackList data={data} />}
         {tricksFromSearch && <BlackList data={tricksFromSearch}  /> }
         {isLoading && <ActivityIndicator color={Colors.accentDark} size={"large"}/>}
      {!data && !isLoading && (
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
