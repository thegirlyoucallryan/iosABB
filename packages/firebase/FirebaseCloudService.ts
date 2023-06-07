import { fbApp } from "./FirebaseConfig";
import { DocumentReference, collection, doc, getDoc } from "firebase/firestore";
const firestore = fbApp.firestore();

const createDocument = (collection, document) => {
  return firestore.collection(collection).add(document);
};

const createDocumentWithUId = (collection, uid, info) => {
  return firestore.collection(collection).doc(uid).set({
    info,
  });
};

const checkIfDocExists = async (path: string, path2: string) => {
  const docRef = doc(firestore, path, path2);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};

const readDocuments = (collection) => {
  return firestore.collection(collection).get();
};

const updateDocument = (collection, id, property) => {
  return firestore.collection(collection).doc(id).update(property);
};
const FbFirestoreService = {
  createDocument,
  readDocuments,
  createDocumentWithUId,
  updateDocument,
  checkIfDocExists,
};

export default FbFirestoreService;
