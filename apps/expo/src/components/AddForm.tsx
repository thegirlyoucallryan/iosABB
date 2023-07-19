import { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "~/constants/colors";
import { PrimaryBtn } from "./HOC/Button";
import Input from "./HOC/Input";
import ImageSelector from "./ImageSelector";
import { useAppSelector } from "~/app/hooks/hooks";
import { Timestamp } from "firebase/firestore";

export type ImageType = {
  url: string,
  type: string
  } | null


function AddForm({
  onSave,
  dropDownOptions,
  isEditing,
  trick,
}: {
  onSave: (trick: any) => void;
  dropDownOptions: string[];
  isEditing?: boolean;
  trick?: any;
}) {

  console.log(isEditing, trick, 'isEditing')
  const [title, setTitle] = useState<{ title: string; isValid: boolean }>(
    isEditing
      ? { title: trick?.title, isValid: true }
      : { title: "", isValid: true },
  );
  const [notes, setNotes] = useState<string>(
   isEditing ? trick?.notes
 : '' );
  
  const [type, setType] = useState<{ type: string; isValid: boolean }>(
    isEditing
      ? { type: trick?.type, isValid: true }
      : { type: "", isValid: true },
  );
  const [image, setImage] = useState(
    isEditing
      ? { image: trick?.image?.url, isValid: true, type: trick?.image?.type }
      : { image: "", isValid: true, type: '' },
  );
  const tricks = useAppSelector((state) => state.tricks.tricks);
  const nextNumber = +tricks.length + 1;
  const dropdownRef = useRef<SelectDropdown>(null)
  const [clearImage, setClearImage] = useState<boolean>(false)
  const imageHandler = (image: ImageType) => {
    console.log(image!.url, 'imguri')
    if(image?.url){
      
    setImage({ image: image?.url, isValid: true, type: image?.type });
    }
  };

  function createNewBookEntry() {
    let trickData;
    if (isEditing) {
      trickData = {
        title: title.title,
        type: type.type,
        image: {url: image?.image, type: image?.type},
        notes:notes,
        id: trick.id,
        editedLast: Timestamp.now(),
        createdAt: trick.createdAt,
      };
    } else {
      trickData = {
        title: title.title,
        type: type.type,
        image:{url: image?.image, type: image?.type},
        notes : notes,
        createdAt: Timestamp.now()
      };
    }

    const titleIsValid = trickData.title.length > 1;
    const imageIsValid = !!trickData.image?.url
    const typeIsValid = trickData.type !== null;

    if (!titleIsValid || !imageIsValid || !typeIsValid) {
      setTitle((current) => {
        return {
          title: current.title,
          isValid: titleIsValid,
        };
      });
      setImage((current) => {
        return {
          image: current.image.url,
          isValid: imageIsValid,
          type: current.image.type
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
    setTitle({title: '', isValid: true})
    setType({type: '', isValid: true})
    setNotes('')
    setImage({image: '', type: '', isValid: true})
    dropdownRef.current?.reset()
    setClearImage(true)
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
            setTitle({ title: text.charAt(0).toUpperCase() + text.slice(1), isValid: true });
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
        ref={dropdownRef}
        data={dropDownOptions}
      
        onSelect={(value) =>
          setType({ type: value?.toUpperCase(), isValid: true })
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
        clearImage={clearImage}
        onTakeImage={imageHandler}
        editImage={isEditing ? trick?.image?.url : null}
        basePath={'tricks'}
      />
      {!image?.isValid && (
        <Text style={styles.errorText}>
          Please select an image. "Name", "type" & "image" are required.
        </Text>
      )}

    
      <Input
        label="Notes"
        textInputConfig={{
          textAlignVertical: "top",
          autoCapitalize: "sentences",
          multiline: true,
          numberOfLines: 3,
          placeholder: " i.e. point your toes",
          placeholderTextColor: Colors.primaryGreen,
          onChangeText: (text: string) => {
            setNotes(text);
          },
          value: notes,
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
