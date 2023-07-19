import { useEffect, useState } from "react"
import {
    ActivityIndicator,
    ImageBackground,
    StyleSheet,
    Text,
    View,
} from "react-native"
import { useFonts } from "expo-font"
import { SplashScreen, useNavigation } from "expo-router"
import { Colors } from "~/constants/colors"
import { Video, ResizeMode, AVPlaybackStatusSuccess } from "expo-av"
import { useQueryClient } from "react-query"
import {  useGetPostsInfiniteQuery } from "../queries"
import { Icon } from "~/components/Icon"

import { useRef } from "react"
import FbFirestoreService, {
    firestore,
} from "../../../../../packages/firebase/FirebaseCloudService"
import { arrayRemove, arrayUnion } from "firebase/firestore"
import { useAppSelector } from "../hooks/hooks"
import CommentsModal from "~/components/modals/CommentsModal"
import SearchBar from "~/components/SearchBar"
import InfiniteFlatlist from "~/components/InfiniteFlatlist"

// import EmptyMessage from "../components/EmptyMessage";
export type Post = {
    id: string
    name: string
    image: { url: string; type: string }
    user: string
    caption: string
    isLikedByUser: boolean
    likes?: string[]
    comments?: { id: string; currentUser: string; commentText: string }[]
}

export default function Home() {
    const apparatus = useAppSelector((s) => s.user.apparatus)
    
    const useInfiniteQuery = useGetPostsInfiniteQuery(apparatus!)
    const { data  } = useInfiniteQuery

    const userName = useAppSelector((s) => s.isAuthenticated.userName)
    const nav = useNavigation()
    const [isReady, setReady] = useState(false)
    const video = useRef(null)
    const [status, setStatus] = useState<AVPlaybackStatusSuccess | {}>({})
    const queryClient = useQueryClient()
    const [caption, setCaption] = useState<string>()
    const [id, setId] = useState<string>()
    const [user, setUser] = useState<string>()
    const [showSearch, setShowSearch] = useState<boolean>()
    const [showCommentsModal, setShowCommentsModal] = useState<boolean>()
    const [searchResults, setSearchResults] = useState<Post[]>()

    useEffect(() => {
        setTimeout(() => {
            setReady(true)
        }, 1000)
    }, [])

    const [loaded] = useFonts({
        Prata: require("../../../assets/fonts/Prata-Regular.ttf"),
    })

    if (!loaded) {
        return null
    }

    const handleAddPost = () => {
        nav.navigate("CreatePost")
    }

    const queryHandler = async (query: string) => {
        let postRef = firestore.collection(`${apparatus}`)
        let searchResult: any = []
        postRef
            .where("user", "==", query.toLowerCase())
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    searchResult.push(doc.data())
                })
                setSearchResults(searchResult)
            })
        postRef
            .where("name", "==", query)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    searchResult.push(doc.data())
                })
                setSearchResults(searchResult)
            })
    }

    const handleCommentsModal = (caption: string, user: string, id: string) => {
        setId(id)
        setCaption(caption), setUser(user)
        setShowCommentsModal(!showCommentsModal)
    }

    const closeCommentsModal = () => {
        setShowCommentsModal(false)
    }

    const handleSearch = () => {
        setShowSearch(!showSearch)
    }

    const handleLikePost = async (id: string, isLiked: boolean) => {
        if (!isLiked && apparatus !== null) {
            try {
                let LikeRef = firestore.collection(`${apparatus}`).doc(id)
                await LikeRef.update({
                    likes: arrayUnion(userName),
                })
                FbFirestoreService.updateDocument(`${apparatus}`, id, {
                    isLikedByUser: true,
                }).then(() => queryClient.refetchQueries("posts"))
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                let LikeRef = firestore.collection(`${apparatus}`).doc(id)
                await LikeRef.update({
                    likes: arrayRemove(userName),
                })
                FbFirestoreService.updateDocument(`${apparatus}`, id, {
                    isLikedByUser: false,
                }).then(() => queryClient.refetchQueries("posts"))
            } catch (error) {
                console.log(error)
            }
        }
    }

    const renderFlatlist = ({ item }: { item: Post }) => {
        return (
            <>
                {item && (
                    <>
                        <View
                            key={item.id}
                            className="my-1 px-1 bg-backgroundGr"
                        >
                            <Text className="text-primary text-md font-sans p-1 ">
                                {item.user.charAt(0).toUpperCase() +
                                    item.user.slice(1)}
                            </Text>

                            {item.image.type && item.image.type === "image" && (
                                <View className="rounded-xl">
                                    <ImageBackground
                                        source={{ uri: item.image.url }}
                                        className="w-full h-72  justify-end rounded-lge"
                                    >
                                        {/* <Text className="text-3xl font-sans  text-bone px-2 ">
                      {item.name}
                    </Text> */}
                                        <View></View>
                                    </ImageBackground>
                                    <Text
                                        // style={{ backgroundColor: Colors.accentDark }}
                                        className="  px-1 pt-2 rounded-sm text-bone"
                                    >
                                        {item.caption}
                                    </Text>
                                </View>
                            )}

                            {item.image.type && item.image.type === "video" && (
                                <>
                                    <View className="h-80 w-full ">
                                        <Video
                                            ref={video}
                                            style={{
                                                flex: 1,
                                                alignSelf: "stretch",
                                            }}
                                            source={{
                                                uri: item.image.url,
                                            }}
                                            useNativeControls
                                            resizeMode={ResizeMode.CONTAIN}
                                            isLooping
                                            onPlaybackStatusUpdate={(status) =>
                                                setStatus(() => status)
                                            }
                                        />
                                    </View>
                                    {/* <Text className="text-3xl font-sans  text-bone  mb-4  ">
                    {item.name}
                  </Text> */}
                                </>
                            )}

                            <View className="flex flex-row justify-between mb-3">
                                <View className="flex flex-row items-center">
                                    <Icon
                                        style={{
                                            marginRight: 1,
                                            marginLeft: 10,
                                        }}
                                        text={""}
                                        name={
                                            item.isLikedByUser
                                                ? "heart"
                                                : "heart-outline"
                                        }
                                        color={Colors.primaryGreenLight}
                                        size={20}
                                        onPress={() =>
                                            handleLikePost(
                                                item.id,
                                                item.isLikedByUser
                                            )
                                        }
                                    />
                                    <Text className="text-primaryGreenLight font-sans text-xs items-center px-1">
                                        {item.likes && item.likes.length}
                                    </Text>
                                    <Icon
                                        style={{ marginHorizontal: 16 }}
                                        text={""}
                                        name={"comment-outline"}
                                        color={Colors.primaryLight}
                                        size={20}
                                        onPress={() =>
                                            handleCommentsModal(
                                                item.caption,
                                                item.user,
                                                item.id
                                            )
                                        }
                                    />
                                </View>
                                <View>
                                    <Icon
                                        style={{ marginHorizontal: 16 }}
                                        text={"Train"}
                                        name={"star-shooting-outline"}
                                        color={Colors.primaryLight}
                                        size={20}
                                        onPress={handleAddPost}
                                    />
                                </View>
                            </View>
                        </View>
                    </>
                )}
            </>
        )
    }

    return (
        <View style={styles.container}>
            {!isReady && <SplashScreen />}

            <View className="flex flex-row justify-center pt-2 bg-backgroundGr">
                {showSearch ? (
                    <View className="flex flex-row items-center">
                        <SearchBar
                            stateHandler={queryHandler}
                            placeholder="Search by 'User' or 'Name'"
                        />
                        <Icon
                            style={styles.close}
                            name={"close"}
                            color={Colors.bone}
                            size={23}
                            text="Close"
                            textStyle={{ fontSize: 10 }}
                            onPress={() => setShowSearch(false)}
                        />
                    </View>
                ) : (
                    <>
                        <Icon
                            style={{ marginHorizontal: 16 }}
                            text={"Post"}
                            name={"plus-box"}
                            color={Colors.primaryLight}
                            size={23}
                            onPress={handleAddPost}
                        />
                        <Icon
                            style={{ marginHorizontal: 16 }}
                            text={"Search"}
                            name={"card-search"}
                            color={Colors.primaryLight}
                            size={24}
                            onPress={handleSearch}
                        />
                    </>
                )}
            </View>

            <View className="pb-12">
                {useInfiniteQuery.isLoading && (
                    <ActivityIndicator
                        size={"large"}
                        color={Colors.primaryGreenLight}
                    />
                )}
                {/* { && (
          <FlatList
            data={searchResults ? searchResults : (postQuery.data.fetchedPosts as Post[])}
            renderItem={renderFlatlist}
            className="mb-2"
          />
        )} */}
                <View style={{ height: "100%" }}>
                    {data && (
                        <InfiniteFlatlist
                            
                            query={useInfiniteQuery}
                            estimatedItemSize={100}
                            bottomInsets={60}
                            renderItem={renderFlatlist}
                        />
                    )}
                </View>

                {showCommentsModal && (
                    <CommentsModal
                        close={closeCommentsModal}
                        caption={caption!}
                        userName={user!}
                        docId={id!}
                    />
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.backgroundBlk,

        flex: 1,
    },
    welcome: {
        color: Colors.bone,
        fontFamily: "Prata",
        fontSize: 22,
        textAlign: "left",
    },
    close: {
        backgroundColor: Colors.primary,
        borderRadius: 4,

        marginTop: -10,
    },
})
