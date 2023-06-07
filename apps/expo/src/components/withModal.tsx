import React from "react";
import { Modal, StyleSheet, View } from "react-native";

import { Colors } from "~/constants/colors";
import { Icon } from "./Icon";

const WithModal = ({
  children,
  close,
  marginTop = 20,
}: {
  children: React.ReactNode;
  close: () => void;
  marginTop?: number | string;
}) => {
  return (
    <Modal animationType="slide" transparent={true}>
      <View style={{ ...styles.container, marginTop: marginTop }}>
        <View style={styles.background}>
          {children}

          <Icon
            color={Colors.primaryLight}
            size={23}
            style={styles.close}
            onPress={close}
            name={"close"}
            text={"Close"}
            textStyle={styles.closeBtn}
          />
        </View>
      </View>
    </Modal>
  );
};

export default WithModal;

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    padding: 20,
    justifyContent: "center",
    textAlign: "center",
    flex: 1,

    backgroundColor: "#2e2e2e",
  },
  close: {
    backgroundColor: Colors.primaryLight,
    color: Colors.niceBlue,
    fontFamily: "Prata",
    alignSelf: "center",
    textAlign: "center",
    padding: 2,
    borderRadius: 5,
  },
  background: {
    height: "80%",
    borderRadius: 10,
    padding: 10,
  },
  closeBtn: {
    fontSize: 11,
  },
});
