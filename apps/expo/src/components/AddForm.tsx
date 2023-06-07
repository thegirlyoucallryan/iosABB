import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useSelector } from "react-redux";

import { Colors } from "~/constants/colors";
import { PrimaryBtn } from "./HOC/Button";
import Input from "./HOC/Input";
import ImageSelector from "./ImageSelector";

function AddForm({
  onSave,
  dropDownOptions,
  isEditing,
  trick,
}: {
  onSave: (trick: any) => void;
  dropDownOptions: string[];
  isEditing?: boolean;
  trick: any;
}) {
  const [title, setTitle] = useState<{ title: string; isValid: boolean }>(
    isEditing
      ? { title: trick?.title, isValid: true }
      : { title: "", isValid: true },
  );
  const [notes, setNotes] = useState<string>(
    isEditing ? trick.notes : undefined,
  );
  const [preRex, setPreRex] = useState<string>(isEditing ? trick.preRex : "");
  const [type, setType] = useState<{ type: string; isValid: boolean }>(
    isEditing
      ? { type: trick.type, isValid: true }
      : { type: "", isValid: true },
  );
  const [image, setImage] = useState(
    isEditing
      ? { image: trick.image, isValid: true }
      : { image: "", isValid: true },
  );
  const tricks = useSelector((state) => state.tricks.tricks);
  const nextNumber = +tricks.length + 1;

  const imageHandler = (imageUri) => {
    console.log(imageUri, 'imguri')
    setImage({ image: imageUri, isValid: true });
  };

  function createNewBookEntry() {
    let trickData;
    if (isEditing) {
      trickData = {
        title: title.title,
        type: type.type,
        image: image.image,
        notes: notes,
        preRex: preRex,
        date: trick.date,
        id: trick.id,
      };
    } else {
      trickData = {
        title: title.title,
        type: type.type,
        image: image.image,
        notes,
        preRex,
        date: new Date().toDateString(),
      };
    }

    const titleIsValid = trickData.title.length > 1;
    const imageIsValid = trickData.image.length > 10;
    const typeIsValid = trickData.type !== null;

    if (!titleIsValid || !titleIsValid || !typeIsValid) {
      setTitle((current) => {
        return {
          title: current.title,
          isValid: titleIsValid,
        };
      });
      setImage((current) => {
        return {
          image: current.image,
          isValid: imageIsValid,
        };
      });
      setType((current) => {
        return {
          type: current.type,
          isValid: typeIsValid,
        };
      });
      return;
    }

    onSave(trickData);
  }

  return (
    <ScrollView style={styles.form}>
      <Input
        label="Title"
        textInputConfig={{
          autoFocus: true,
          minLength: 1,
          placeholder: "If no name try a number",
          iconName: "numeric",
          iconOnPress: () =>
            setTitle({
              title:
                nextNumber < 10
                  ? nextNumber.toString().padStart(2, "0")
                  : nextNumber.toString(),
              isValid: true,
            }),

          placeholderTextColor: Colors.primaryGreen,
          onChangeText: (text: string) => {
            setTitle({ title: text, isValid: true });
          },
          value: title.title,
          invalid: { title: title.isValid },
        }}
      />
      {!title.isValid && (
        <Text style={styles.errorText}>
          Please enter a name. "Name", "type" & "image" are required.
        </Text>
      )}
      <View>
        <Pressable
          onPress={() =>
            setTitle({
              title:
                nextNumber < 10
                  ? nextNumber.toString().padStart(2, "0")
                  : nextNumber.toString(),
              isValid: true,
            })
          }
          style={styles.nextNumberContainer}
        >
          <MaterialCommunityIcons
            name={"numeric"}
            size={23}
            color={Colors.primaryLight}
          />
          <Text
            style={{
              alignSelf: "center",
              marginLeft: 4,
              fontSize: 14,
              color: Colors.primaryLight,
              fontWeight: "300",
            }}
          >
            Use Next Number
          </Text>
        </Pressable>
      </View>
      <Text
        style={{
          color: Colors.bone,
          marginVertical: 7,
          fontFamily: "Prata",
          fontSize: 14,
        }}
      >
        Type
      </Text>
      <SelectDropdown
        data={dropDownOptions}
        onSelect={(value) =>
          setType({ type: value.toUpperCase(), isValid: true })
        }
        defaultButtonText={"Select Type"}
        dropdownOverlayColor={Colors.backgroundGr}
        rowStyle={{ ...styles.rowText }}
        rowTextStyle={styles.rowText}
        renderCustomizedRowChild={(value) => (
          <View className="flex flex-row justify-between px-5">
            <Text style={styles.rowText}>{value}</Text>
            <MaterialCommunityIcons
              name="star-check"
              size={18}
              color={Colors.primaryLight}
            />
          </View>
        )}
        buttonStyle={{ ...styles.dropdown, ...styles.dropdownBTN }}
        buttonTextStyle={styles.dropdown}
        renderDropdownIcon={() => (
          <MaterialCommunityIcons
            name="arrow-down-drop-circle"
            size={23}
            color={Colors.primaryLight}
          />
        )}
      />
      {!type.isValid && (
        <Text style={styles.errorText}>
          Please select a Type. "Name", "type" & "image" are required.
        </Text>
      )}

      <ImageSelector
        onTakeImage={imageHandler}
        editImage={isEditing ? trick.image : null}
        basePath={'tricks'}
      />
      {!image.isValid && (
        <Text style={styles.errorText}>
          Please select an image. "Name", "type" & "image" are required.
        </Text>
      )}

      <Input
        label="Notes"
        textInputConfig={{
          autoCapitalize: "sentences",
          mulitiline: true,
          numberOfLines: 3,
          placeholder: " i.e. point your toes",
          placeholderTextColor: Colors.primaryGreen,
          onChangeText: (text: string) => {
            setNotes(text);
          },
          value: notes,
        }}
      />
      <Input
        label="Prerequisites"
        textInputConfig={{
          autoCapitalize: "sentences",
          mulitiline: true,
          numberOfLines: 3,
          placeholder: "i.e. V-up or inversion",
          placeholderTextColor: Colors.primaryGreen,
          onChangeText: (text: string) => {
            setPreRex(text);
          },
          value: preRex,
        }}
      />
      <View style={{ width: "60%", alignSelf: "center", margin: 12 }}>
        <PrimaryBtn text="Save" onPress={createNewBookEntry} />
      </View>
    </ScrollView>
  );
}

export default AddForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 20,
    backgroundColor: Colors.backgroundGr,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 25,
    padding: 10,
  },
  rowText: {
    backgroundColor: Colors.backgroundBlk,
    color: Colors.primaryLight,
    fontFamily: "Prata",
    fontSize: 14,
    borderBottomColor: "transparent",
  },

  dropdown: {
    color: Colors.primaryLight,
    fontFamily: "Prata",
    backgroundColor: Colors.backgroundBlk,
    alignSelf: "center",
    height: 35,
    fontSize: 14,
    // borderColor: "white",
    // borderWidth: 1,
  },
  dropdownBTN: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    paddingTop: 8,
    alignItems: "stretch",
    borderColor: Colors.primaryLight,
    borderWidth: 0.6,
  },
  errorText: {
    textAlign: "left",
    marginTop: 1,
    color: Colors.primaryGreenLight,
    fontSize: 11,
  },
  nextNumberContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
