import { fbApp } from "./FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Apparatus, Trick } from "../store/tricks-redux";

export const firestore = fbApp.firestore();

const createDocument = async (
  collection: string,
  documentData: any,
  id: string
) => {
  return firestore.collection(collection).doc(id).set(documentData);
};

const createDocumentWithUId = (collection: string, uid: string, info: any) => {
  return firestore.collection(collection).doc(uid).set({
    info,
  });
};

const checkIfDocExists = async (path: string, path2: string) => {
  const docRef = doc(firestore, path, path2);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};

export type Order = "desc" | "asc";

const readDocuments = (collection: string, order: Order) => {
  return firestore.collection(collection).orderBy("createdAt", order).get();
};

const updateDocument = (collection: string, id: string, property: any) => {
  return firestore.collection(collection).doc(id).update(property);
};
const updateNestedDocument = (
  collection1: string,
  userId: string,
  collection2: string,
  id: string,
  property: any
) => {
  return firestore
    .collection(collection1)
    .doc(userId)
    .collection(collection2)
    .doc(id)
    .update(property);
};

const addTrick = (
  collectionName: string,
  userId: string,
  id: string,
  trick: Trick
) => {
  return firestore
    .collection("users")
    .doc(userId)
    .collection(collectionName)
    .doc(id)
    .set(trick);
};

const deleteTrick = (userId: string, apparatus: Apparatus, trickId: string) => {
  return firestore
    .collection("users")
    .doc(userId)
    .collection(`${apparatus}-tricks`)
    .doc(trickId)
    .delete();
};
const FbFirestoreService = {
  createDocument,
  readDocuments,
  createDocumentWithUId,
  updateDocument,
  checkIfDocExists,
  addTrick,
  updateNestedDocument,
  deleteTrick,
};

export default FbFirestoreService;
