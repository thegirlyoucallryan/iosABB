import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "~/constants/colors";
import EmptyMessage from "../../components/EmptyMessage";
import { WithFlatlist } from "../../components/withFlatlist";
import WithModal from "../../components/withModal";
import Input from "../HOC/Input";

//if you haven't gone to blackbook you havent loaded your store.

const GoalsModal = ({ close }: { close: () => void }) => {
  const [goals, setGoals] = useState<string[]>([]);
  const [goal, setGoal] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);

  const individualGoalHandler = () => {
    setShowInput(!showInput);
    if (showInput) {
      setGoals((current) => [...current, goal]);
      console.log(goals);
      setGoal("");
    }
  };

  const addGoalInput = (
    <View style={styles.addInput}>
      <Input
        textInputConfig={{
          placeholder: 'Set a goal and then hit "add goal" below',
          onChangeText: (text: string) => setGoal(text),
          placeholderTextColor: Colors.niceBlue,
          autoCapitalize: "words",
          value: goal,
        }}
      />
    </View>
  );

  return (
    <View>
      <WithModal close={close}>
        <View>
          <Text style={styles.headline}>My Goals</Text>

          {goals.length === 0 ? (
            <EmptyMessage
              headingText={"No goals have been set,"}
              msgText={"Lets change that by adding a couple of exciting goals."}
            />
          ) : (
            <View style={styles.goalBox}>
              <WithFlatlist data={goals} />
            </View>
          )}

          {showInput && addGoalInput}
          <Pressable onPress={individualGoalHandler}>
            <Text style={styles.close}>ADD GOAL</Text>
          </Pressable>
        </View>
      </WithModal>
    </View>
  );
};

export default GoalsModal;

const styles = StyleSheet.create({
  headline: {
    fontFamily: "Prata",
    fontSize: 25,
    textAlign: "center",
    margin: 10,
    color: Colors.accentDark,
  },

  close: {
    color: Colors.primaryLight,
    fontSize: 18,
    fontFamily: "Prata",
    alignSelf: "center",
    textAlign: "center",
    width: "60%",
    borderRadius: 20,
    padding: 10,
    margin: 30,
  },

  addInput: {
    marginVertical: 15,

    alignItems: "center",
    minWidth: "100%",
  },
  goalBox: {
    height: "50%",
    alignSelf: "center",
  },
});
