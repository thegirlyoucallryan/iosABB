import { useInfiniteQuery } from "react-query"
import { Post } from "../(main)/Home"
import { firestore } from "../../../../../packages/firebase/FirebaseCloudService"
import { Apparatus, Trick } from "../../../../../packages/store/tricks-redux"
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";



export const getPosts = async (apparatus: Apparatus, cursor = null) => {
  const pageSize = 10; // Number of items to fetch per page
  const query = 
    firestore
    .collection(`${apparatus}`)
    .orderBy('createdAt', 'desc')
 
   let data: Post[] = [];

  if(cursor){
  const snapshot = await query.limit(pageSize).startAfter(cursor).get()
  console.log(snapshot.docs, 'snops')

 
  snapshot.forEach((doc) => {
    const post = doc.data() as Post
    data.push({  ...post, id: doc.id, })    
  });

  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  const hasNextPage = data.length === pageSize;
  return {
    data: data,
    cursor: hasNextPage ? lastVisible : undefined,
    hasNextPage,
  };
  
  }else{
const snapshot = await query.limit(pageSize).get();
 

  const data: Post[] = [];
  snapshot.forEach((doc) => {
    const post = doc.data() as Post
    data.push({  ...post, id: doc.id});
   
  });

  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  const hasNextPage = snapshot.docs.length === pageSize;

  return {
    data: hasNextPage ? data : [],
    cursor: hasNextPage ? lastVisible : undefined,
    hasNextPage,
  };
  }
 };

export async function getTricks(userId: string, apparatus: Apparatus) {
    let tricks: Trick[] = []
    try {
        const resp = await firestore
            .collection("users")
            .doc(userId)
            .collection(`${apparatus}-tricks`)
            .orderBy("createdAt", "desc")
            .get()
        const restructuredTricks = resp.docs.map((postDoc) => {
            const id = postDoc.id
            const data = postDoc.data() as Trick

            return { ...data, id }
        })
        tricks = [...restructuredTricks]
    } catch (error: any) {
        console.log(error)
    }

    return tricks
}

export const getComments = async (id: string, apparatus: Apparatus) => {
    let fetchedComments: {
        id: string
        currentUser: string
        commentText: string
    }[] = []

    try {
        const commentRef = firestore.collection(`${apparatus}`).doc(id)
        await commentRef.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data()
                fetchedComments = [...data?.comments]
                console.log(fetchedComments, "fetched")
            }
        })
    } catch (error) {
        console.log(error)
    }
    return fetchedComments
}

export type GetAllPostsInfiniteResponse = {
    data: Post[]
    cursor?: QueryDocumentSnapshot<Post>
    hasNextPage: boolean
}

export function useGetPostsInfiniteQuery(apparatus: Apparatus) {
    const key = ["posts"]
    return useInfiniteQuery(
        key,
        async ({ pageParam = 0 }) => {
            return await getPosts(apparatus, pageParam)
        },
        {
            getNextPageParam: (lastPage) => {
                if (!lastPage.cursor) return undefined
                return lastPage.cursor
            },
        }
    )
}


