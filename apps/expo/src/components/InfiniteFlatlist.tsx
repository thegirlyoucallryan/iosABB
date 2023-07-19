import {  useSafeAreaInsets } from "react-native-safe-area-context";
import { UseInfiniteQueryResult } from "react-query";
import { GetAllPostsInfiniteResponse, getPosts } from "~/app/queries";
import { Post } from "~/app/(main)/Home";
import { ActivityIndicator } from "react-native";
import { Colors } from "~/constants/colors";
import{ FlashList }from "@shopify/flash-list";


function InfiniteFlatlist
// <
// QueryResult extends UseInfiniteQueryResult<
// GetAllPostsInfiniteResponse,
// unknown
// >,
// >
({  
  
    query,
    estimatedItemSize,
    bottomInsets,
    renderItem
    }:{
     
        query:any
        estimatedItemSize: number,
        bottomInsets: number,
        renderItem:({ item }: { item: Post; }) => React.JSX.Element

    }){
        // const canLoadMore = query && query.hasNextPage
      

        const {
            fetchNextPage,
            isLoading,
            isFetchingNextPage,
            hasNextPage,
            isError,
            error,
                    } = query
 
        // const data = (() => {
        //     if(!query.data) return []
        //     return query.data.pages.map((post) => post.data).flat()
        // })()
        // console.log(data)

        return(
            <>
            <FlashList 
            estimatedItemSize={estimatedItemSize}
            scrollEventThrottle={18}
            data={query.data?.pages.map((post: any) => post.data).flat()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0}
            ListFooterComponent={
                isLoading || isFetchingNextPage ? (
                    () => {
                        return (
                            <>
                            <ActivityIndicator color={Colors.primaryGreenLight} size={20} style={{marginBottom: bottomInsets}}/>
                            </>
                        )
                    }
                ):
                <>
                </>
            }
            onEndReached={() => {
                if(hasNextPage && !isFetchingNextPage){
                    fetchNextPage()
                }
            }}

            />
            </>
        )

    }

    export default InfiniteFlatlist