import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import proptypes from "prop-types";
import { useSelector } from "react-redux";

import { Colors } from "~/constants/colors";
import EmptyMessage from "../../components/EmptyMessage";
import WithModal from "../../components/withModal";

const tallyMarks = require("tally-marks");

// CompleteModal.propTypes= {
//   close: () => void
// }

const CompleteModal = (props) => {
  const completed = useSelector((state) => state.tricks.completed);

  return (
    <View style={styles.listContainer}>
      <WithModal close={props.close}>
        <View>
          <Text style={styles.headline}>My Stats</Text>
          {completed && completed?.length === 0 ? (
            <EmptyMessage
              headingText={"You haven't marked anything complete,"}
              msgText={
                "You can mark things complete in the train tab using the complete button. One click on complete marks the trick off but you can keep clicking to keep a tally."
              }
            />
          ) : (
            <ScrollView style={{ height: "80%" }}>
              {completed.map((item) => (
                <View key={item.id} style={styles.listContainer}>
                  <View style={styles.nameColumn}>
                    <Text numberOfLines={1} style={styles.item}>
                      {item.title}
                    </Text>
                  </View>
                  <View style={styles.tallyColumn}>
                    <Text style={styles.item}>
                      {item.tally > 10 ? item.tally : tallyMarks(item.tally)}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </WithModal>
    </View>
  );
};

export default CompleteModal;

const styles = StyleSheet.create({
  headline: {
    fontFamily: "Prata",
    fontSize: 25,
    color: Colors.primaryLight,
    letterSpacing: 0.2,
    textAlign: "center",
    marginBottom: 14,
  },

  item: {
    color: Colors.accentLight,
    fontSize: 15,
    fontFamily: "Prata",
    marginLeft: 10,
    margin: 3,
    textTransform: "capitalize",
    maxWidth: "65%",
  },
  listContainer: {
    justifyContent: "center",
    flexDirection: "row",
    margin: 7,
    borderBottomColor: Colors.backgroundGr,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  nameColumn: {
    width: "89%",
  },
  tallyColumn: {
    width: "20%",
  },
});
