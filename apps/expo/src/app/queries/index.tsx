import FbFirestoreService from "../../../../../packages/firebase/FirebaseCloudService";
import FirebaseCloudService from "../../../../../packages/firebase/FirebaseCloudService";

///Home Screen get all ... 
export async function getPosts(apparatus: string) {
    let fetchedPosts = [];

    try {
      const response = await FirebaseCloudService.readDocuments(`${apparatus}`);

      const restructuredPosts = response.docs.map((postDoc) => {
        const id = postDoc.id;

        const data = postDoc.data();
        return { ...data, id };
      });
      fetchedPosts = [...restructuredPosts];
    } catch (error) {
      console.log(error);
      throw error;
    }
    return fetchedPosts;
  }



