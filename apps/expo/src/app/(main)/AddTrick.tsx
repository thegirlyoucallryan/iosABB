import { ScrollView, StyleSheet, Text } from "react-native"
import { useFocusEffect, useNavigation, useSearchParams } from "expo-router"
import uuid from "react-native-uuid"
import { useAppSelector,  } from "../hooks/hooks"
import { Colors } from "~/constants/colors"
import AddForm from "../../components/AddForm"
import { Trick } from "../../../../../packages/store/tricks-redux"
import FbFirestoreService, {
    firestore,
} from "../../../../../packages/firebase/FirebaseCloudService"
import { useQueryClient } from "react-query"
import Toast from "react-native-toast-message"
import { useGetFetchQuery } from "../hooks/useQueryClient"
import {  useCallback, useEffect, useState } from "react"

const AddTrick = () => {
  
     
    const userId = useAppSelector((state) => state.userId.userId)
    const apparatus = useAppSelector((s) => s.user.apparatus)
    const queryClient = useQueryClient()
    const nav = useNavigation()



      const { id, isEditing } = useSearchParams()
      const data = useGetFetchQuery("tricks") as Trick[]
      const trickToEdit = data ?  data.find((d) => d.id === id) : null
    
    nav.addListener('blur', () => {nav.setParams({isEditing: false})})

    console.log(trickToEdit, isEditing, 'addtrickone')
    const saveTrickHandler = async (trick: Trick) => {
        const trickId = uuid.v4().toString()
        try {
            const nameRef = firestore
                .collection("users")
                .doc(userId)
                .collection(`${apparatus}-tricks`)
                .where("title", "==", trick.title)
            nameRef.get().then((snap) => {
                if (snap.empty) {
                    FbFirestoreService.addTrick(
                        `${apparatus}-tricks`,
                        userId,
                        trickId,
                        trick
                    )
                        .then(() => queryClient.refetchQueries(["tricks"]))
                        .then(() => queryClient.invalidateQueries(["tricks"]))
                        .then(() => nav.navigate("Blackbook"))
                }
                if (!snap.empty) {
                    Toast.show({
                        type: "error",
                        text1: "Trick alread exists",
                        text2: "Sorry, this name is taken, please choose another one.",
                    })
                }
            })
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message,
            })
        }
    }
    const editTrickHandler = async (trick: Trick) => {
        try {
            FbFirestoreService.updateNestedDocument(
                "users",
                userId,
                `${apparatus}-tricks`,
                trick.id,
                trick
            )
            .then(() => queryClient.refetchQueries(["tricks"]))
            .then(() => {
                queryClient.invalidateQueries('tricks')
            }).then(() => nav.navigate("TrickDetails", { id: trick.id }))
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message,
            })
        }
    }

    const options = [
        "Climb",
        "Conditioning",
        "Drop",
        "Belay",
        "Split",
        "Roll",
        "Pose",
        "Other",
    ]

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.add}>Create New Entry</Text>
            <AddForm
                onSave={!!isEditing ? editTrickHandler : saveTrickHandler}
                dropDownOptions={options}
                isEditing={!!isEditing}
                trick={isEditing ? trickToEdit : null}
            />
        </ScrollView>
    )
}

export default AddTrick

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.backgroundBlk,
        flex: 1,
    },
    add: {
        color: Colors.bone,
        fontFamily: "Prata",
        fontSize: 20,
        paddingTop: 15,
        marginLeft: 10,
    },
})
