import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import EmptyMessage from "~/components/EmptyMessage";
import { Icon } from "~/components/Icon";
import { Colors } from "~/constants/colors";
import { Trick, removeFromFavorites, setComplete } from "../../../../../packages/store/tricks-redux";
import CompleteModal from "../../components/modals/CompleteModal";
import GeneratorModal from "../../components/modals/GeneratorModal";
import GoalsModal from "../../components/modals/GoalsModal";
import { Link, useNavigation } from "expo-router";
import { useAppSelector, useAppDispatch } from '../hooks/hooks'
import FbFirestoreService from "../../../../../packages/firebase/FirebaseCloudService";


const tallyMarks = require("tally-marks");

const TrainingDay = () => {
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const nav = useNavigation();
  const favorites = useAppSelector((state) => state.tricks.favorites);
  const completed = useAppSelector((state) => state.tricks.completed);

  const dispatch = useAppDispatch();

  const generatorHandler = () => {
    setShowGeneratorModal(!showGeneratorModal);
  };
  const goalHandler = () => {
    setShowGoalsModal(!showGoalsModal);
  };
  const completeModalHandler = () => {
    setShowCompletedModal(!showCompletedModal);
  };
  const tallyHandler = (id: string) => {
    const indx = completed.findIndex((item) => item.id === id);
    if (indx > -1 && completed[indx].tally) {
      const amt = completed[indx].tally!;
      return amt < 11 ? (
        tallyMarks(amt)
      ) : (
        <Text style={{ fontSize: 12 }}>{amt}</Text>
      );
    }
  };

  const handleComplete = (id: string, item: Trick) => {
    dispatch(setComplete(item))
    // try{
    //   FbFirestoreService.updateDocument()
    // }
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {showGeneratorModal && <GeneratorModal close={generatorHandler} />}
        {showGoalsModal && <GoalsModal close={goalHandler} />}
        {showCompletedModal && <CompleteModal close={completeModalHandler} />}

        <Pressable
          style={styles.tab}
          onPress={() => {
            setShowGeneratorModal(!showGeneratorModal);
          }}
        >
          <Text style={{...styles.tabItem, color: Colors.primary}}>Motivation</Text>
        </Pressable>

        {/* <Pressable
          style={{ ...styles.tab, backgroundColor: Colors.backgroundGr }}
          onPress={() => {
            setShowCompletedModal(!showCompletedModal);
          }}
        >
          <Text style={styles.tabItem}>Completed</Text>
        </Pressable> */}

        <Pressable
          style={ styles.tab }
          onPress={() => {
            setShowGoalsModal(!showGoalsModal);
          }}
        >
          <Text style={{...styles.tabItem, color: Colors.primaryGreenLight}}>Goals</Text>
        </Pressable>
      </View>
      <Text style={styles.heading}>Things to Train</Text>

      <View style={styles.todoContainer}>
        {favorites.length === 0 ? (
          <EmptyMessage
            headingText={"Nothing to work on...yet,"}
            msgText={
              " Start adding things to do in the blackbook tab by clicking the train icon."
            }
          />
        ) : (
          <ScrollView style={{ flex: 1 }}>
            {favorites.map((item) => (
              <View key={item.title} style={styles.mapContainer}>
                <View style={styles.itemBox}>
                  <Link
                    style={!item.completed ? styles.item : styles.pressedItem}
                    href={{
                      pathname: "../../TrickDetails",
                      params: {
                        data: item.title,
                      },
                    }}
                  >
                    {item?.title.length < 30 ? item?.title : item?.title.substring(0,30) + '...'}
                  </Link>

                  <Text numberOfLines={1} style={styles.tally}>
                    {tallyHandler(item.id)}
                  </Text>
                </View>

                <View style={styles.iconBox}>
                  <Icon
                    color={Colors.primaryLight}
                    name={"check-underline-circle-outline"}
                    size={25}
                    onPress={() => handleComplete(item.id, item)}
                    text={"Complete"}
                    textStyle={{ fontSize: 9 }}
                  />
                  <Icon
                   
                    color={Colors.accentLight}
                    name={"star-shooting"}
                    size={25}
                    onPress={() => {
                      dispatch(removeFromFavorites(item.id));
                    }}
                    text={"Remove"}
                    textStyle={{ fontSize: 9 }}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default TrainingDay;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundBlk,
    flex: 1,
 
  },

  quote: {
    textAlign: "center",
    color: "black",
    padding: 5,
    fontSize: 14,
    marginHorizontal: 20,
    fontWeight: "300",
  },
  heading: {
    color: Colors.primaryLight,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Prata",
    marginTop: 8,
  },
  itemBox: {
    flexDirection: "row",
    width: "70%",
    alignItems: "center",
  },
  item: {
    color: Colors.primary,
    fontSize: 15,
    fontFamily: "Prata",
    textAlign: "left",
    // marginLeft: 10,
    margin: 3,
    textTransform: "capitalize",
    // maxWidth: "70%",
  },
  tally: {
    color: Colors.primary,
    fontSize: 17,
    width: "20%",
  },
  todoContainer: {
    height: "85%",
    margin: 15,
    borderRadius: 4,
    padding: 10,
    
  },

  mapContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  iconBox: {
    flexDirection: "row",
    width: '30%',
    justifyContent: "space-between",
    alignItems: "center",
 
  },
  tabContainer: {
    flexDirection: "row",
 

  },
  tab: {
    padding: 15,
    flex: 1,
    backgroundColor: Colors.backgroundGr,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 5,
    
  },
  tabItem: {
    color: Colors.bone,
    fontSize: 15,
    fontFamily: "Prata",
    alignSelf: "flex-end",
  },
  emptyMsg: {
    color: Colors.bone,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 60,
    letterSpacing: 1,
  },
  emptyP: {
    color: Colors.bone,
    textAlign: "center",
    letterSpacing: 0.5,
    marginHorizontal: 45,
  },
  pressedItem: {
    color: Colors.niceBlue,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    fontSize: 15,
    fontFamily: "Prata",
    textAlign: "center",
    // marginLeft: 10,
    margin: 3,
    textTransform: "capitalize",
    maxWidth: "70%",
  },
  btnBox: {
    margin: 15,
    alignSelf: "center",
  },
});
