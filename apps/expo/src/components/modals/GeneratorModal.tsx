import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

import { Colors } from "~/constants/colors";
import { conditioning } from "~/constants/conditioning";
import WithModal from "../../components/withModal";
import { Icon } from "../Icon";

//if you haven't gone to blackbook you havent loaded your store.

const GeneratorModal = (props) => {
  const [trick, setTrick] = useState<string>("");
  let tricksFromState = useSelector((state: any) => state.tricks.tricks);
  let trickNames = tricksFromState.map((item) => item.title);

  let totalGenerator = [...conditioning, ...trickNames];

  const trainerTrickSelector = () => {
    let randomTrick = Math.floor(Math.random() * totalGenerator.length);
    let trick = totalGenerator[randomTrick];
    setTrick(trick);
  };

  useEffect(() => {
    trainerTrickSelector();
  }, []);

  return (
    <View>
      <WithModal close={props.close}>
        <View>
          <Text style={styles.headline}>Need help getting started?</Text>
        
            <View className="flex flex-row justify-between px-10 mt-9">
             
              <Icon color={Colors.bone} name="star-shooting-outline" size={24} text="Train" onPress={() => {}} />
              <Icon color={Colors.primaryLight} name="arrow-right" size={24} text="Next" onPress={() => trainerTrickSelector()} />
            
            </View>
            <View style={styles.directionBox}>
            <Text style={styles.idea}>{trick}</Text>
          </View>
        </View>
      </WithModal>
    </View>
  );
};

export default GeneratorModal;

const styles = StyleSheet.create({
  headline: {
    fontFamily: "Prata",
    fontSize: 24,
    color: Colors.bone,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  directionBox: {
    padding: 40,
    borderRadius: 5,
    margin: 10,
    height: "70%",
    borderBottomColor: Colors.niceBlue,
    borderBottomWidth: 0.2,
    justifyContent: "center",
  },
  idea: {
    fontSize: 26,
    fontFamily: "Prata",
    textAlign: "center",
    color: Colors.niceBlue,
  },

});
