import { Alert, Platform, StyleSheet, Text, View } from "react-native"
import { useNavigation } from "expo-router"
import { Colors } from "~/constants/colors"
import {
    toggleFavorites,
    TrickType,
    Trick,
} from "../../../../../packages/store/tricks-redux"
import { Icon } from "../../components/Icon"
import WithModal from "../../components/withModal"
import { useAppDispatch, useAppSelector } from "~/app/hooks/hooks"
import * as Sharing from "expo-sharing"
import FbFirestoreService, {
    firestore,
} from "../../../../../packages/firebase/FirebaseCloudService"
import { Toast } from "react-native-toast-message/lib/src/Toast"
import { useQueryClient } from "react-query"
import * as Progress from "react-native-progress"
import * as FileSystem from "expo-file-system"
import { useState } from "react"
import { FileSystemDownloadResult } from "expo-file-system"

export const DetailModal = ({
    close,
    trick,
    favorites,
}: {
    close: () => void
    trick: Trick
    favorites: Trick[]
}) => {
    const { title, notes, id, type, isFavorite, completed, image, tally } =
        trick
    const dispatch = useAppDispatch()
    const userId = useAppSelector((s) => s.isAuthenticated.userId)
    const apparatus = useAppSelector((s) => s.user.apparatus)
    const nav = useNavigation()
    const [shareProgress, setShareProgress] = useState<number>(-1)
    const queryClient = useQueryClient()
    const toggleFavoritesHandler = (
        title: string,
        id: string,
        type: TrickType
    ) => {
        dispatch(
            toggleFavorites({
                title,
                id,
                type,
                completed,
                isFavorite,
                image,
                tally,
            })
        )
    }

    function deleteHandler(id: string) {
        Alert.alert(
            "Delete?",
            "Are you sure you want to delete this item?",
            [
                {
                    text: "Yes, Delete",
                    onPress: () => {
                        try {
                            FbFirestoreService.deleteTrick(
                                userId,
                                apparatus,
                                id
                            )
                                .then(() =>
                                    queryClient.refetchQueries("tricks")
                                )
                                .then(() =>
                                    queryClient.invalidateQueries(["tricks"])
                                )
                                .then(() => {
                                    nav.navigate("Blackbook")
                                })
                        } catch (error: any) {
                            Toast.show({
                                type: "error",
                                text1: "Error",
                                text2: error.message,
                            })
                        }
                    },
                },
                { text: "Cancel" },
            ],
            { cancelable: true }
        )
    }

    const shareToInstagram = async (image: { type: string; url: string }) => {
        const callback = (downloadProgress: any) => {
            const progress =
                downloadProgress.totalBytesWritten /
                downloadProgress.totalBytesExpectedToWrite
            setShareProgress(progress)
        }
        const fileType = image.type === "image" ? "jpeg" : ".mp4"

        const downloadResumable = FileSystem.createDownloadResumable(
            image.url,
            FileSystem.documentDirectory + fileType,
            {},
            callback
        )

        try {
            const { uri } = await downloadResumable.downloadAsync() as FileSystemDownloadResult;
            console.log("Finished downloading to ", uri)
            Sharing.shareAsync(uri).then(() => setShareProgress(-1))
        } catch (e: any) {
            setShareProgress(-1)
            Toast.show({
                type: "error",
                text1: "Error",
                text2: e?.message,
            })
        }
    }

    return (
        <WithModal close={close} marginTop={"89%"}>
            <View>
                <View style={styles.iconContainer}>
                    <Icon
                        name={
                            favorites.find((favorite) => favorite.id === id)
                                ? "star-shooting"
                                : "star-shooting-outline"
                        }
                        color={Colors.primaryLight}
                        size={27}
                        text={"Train"}
                        textStyle={{ fontSize: 10 }}
                        onPress={() => {
                            toggleFavoritesHandler(title, id, type)
                        }}
                    />

                    <Icon
                        name={"instagram"}
                        color={Colors.accentLight}
                        size={27}
                        text={"Share"}
                        textStyle={{ fontSize: 10 }}
                        onPress={() => {
                            shareToInstagram(trick.image)
                        }}
                    />
                    <Icon
                        name={"trash-can"}
                        color={Colors.accentDark}
                        size={27}
                        text={"Delete"}
                        textStyle={{ fontSize: 10 }}
                        onPress={() => deleteHandler(id)}
                    />
                    <Icon
                        name={"pencil"}
                        color={Colors.bone}
                        size={27}
                        text={"Edit"}
                        textStyle={{ fontSize: 10 }}
                        onPress={() => {
                            close()
                            nav.navigate("AddTrick", {
                                isEditing: true,
                                id: trick.id,
                            })
                        }}
                    />
                </View>

                <Text style={{ ...styles.label, marginBottom: 5 }}>
                    {title}
                </Text>
                <Text style={styles.text}>{type}</Text>
                {/* <Text style={styles.text}>Added: {createdAt.slice(4)}</Text> */}
                {!notes && (
                    <Text style={styles.error}>
                        No additional information was entered.
                    </Text>
                )}
                {notes ? (
                    <View style={styles.info}>
                        <Text style={styles.label}>Notes</Text>
                        <Text style={styles.text}>{notes}</Text>
                    </View>
                ) : null}
                {/* {preReqs ? (
          <View style={styles.info}>
            <Text style={styles.label}>Prerequisites</Text>
            <Text style={styles.text}>{preReqs}</Text>
          </View>
        ) : null} */}
                {shareProgress > 0 && (
                    <Progress.Bar
                        progress={shareProgress}
                        width={300}
                        color={Colors.primary}
                        style={{
                            display: "flex",
                            alignSelf: "center",
                            justifyContent: "center",
                        }}
                    />
                )}
            </View>
        </WithModal>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 19,
        fontFamily: "Prata",
        color: Colors.primary,
        textTransform: "capitalize",
    },
    info: {
        justifyContent: "space-between",
        marginHorizontal: 8,
        padding: 5,
    },
    text: {
        fontSize: 13,
        textTransform: "capitalize",
        marginBottom: 10,
        color: Colors.bone,
        fontWeight: "300",
        letterSpacing: 1,
    },
    error: {
        textAlign: "center",
        fontSize: 16,
        padding: 25,
        color: Colors.bone,
        fontWeight: "300",
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 18,
        paddingBottom: 18,
        borderBottomColor: Colors.bone,
        borderBottomWidth: 0.5,
    },
    cancel: {
        color: Colors.accentDark,
    },
})
