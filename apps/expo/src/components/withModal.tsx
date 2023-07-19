import React, { useMemo } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Colors } from "~/constants/colors";
import { Icon } from "./Icon";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

const WithModal = ({
  children,
  close,
  marginTop = 20,
}: {
  children: React.ReactNode;
  close: () => void;
  marginTop?: number | string;
}) => {

  const gesture = useMemo(() => Gesture.Pan().onEnd(() => {
       close();
  }), [])


  return (
    <Modal animationType="slide" transparent={true}>
       <GestureHandlerRootView style={{flex:1}}>
      <GestureDetector
        gesture={gesture}
      >
         
        <View style={{ ...styles.container, marginTop: marginTop }}>
        <View className="flex items-end">
              <Icon
                color={Colors.primaryLight}
                size={23}
                style={styles.close}
                onPress={close}
                name={"close"}
                // text={"Close"}
                // textStyle={styles.closeBtn}
              />
            </View>
          <View style={styles.background}>
         
            {children}
           
          </View>
        </View>
      </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default WithModal;

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    paddingHorizontal: 20,
    justifyContent: "center",
    textAlign: "center",
    flex: 1,
    backgroundColor: Colors.video,
  },
  close: {
    color: Colors.primaryGreenLight,
    fontFamily: "Prata",
    textAlign: "center",
    padding: 2,
    borderRadius: 5,
  },
  background: {
    height: "80%",
    borderRadius: 10,
    // padding: 10,
  },
  closeBtn: {
    fontSize: 11,
  },
});
