// import { fbApp } from "./FirebaseConfig";

// const storageRef = fbApp.storage().ref();

// const uploadFile = (file, filePath, progressCallback) => {
//     const uploadTask = storageRef.child(filePath).put(file);

//     uploadTask.on(
//         'state Changed',
//         (snapshot) => {
//             const progress = Math.round(
//                 (snapshot.bytesTransferred/snapshot.totalBytes) * 100
//             )
//             progressCallback(progress)
//         },
//         (error) => {
//             throw error;
//         }
//     )
//     return uploadTask.then(async() => {
//         const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
//         return downloadURL;
//     })
// }


//  const FirebaseStorage = {
//     uploadFile,
// }

// export default FirebaseStorage;

import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import {fbApp} from "./FirebaseConfig";





const uploadFile = (file, fullFilePath, progressCallback) => {

  const storageRef = fbApp.storage()
  const uploadTask = storageRef.ref(fullFilePath);
 const upload = uploadBytes(uploadTask, file)

  // uploadTask.on(
  //   "state_changed",
  //   (snapshot) => {
  //     const progress = Math.round(
  //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //     );

  //     progressCallback(progress);
  //   },
  //   (error) => {
  //     throw error;
  //   }
  // );

  return upload.then(async () => {
    const downloadUrl = await getDownloadURL(ref(storageRef, fullFilePath))

    return downloadUrl;
  });
};

const deleteFile = (fileDownloadUrl) => {
  const decodedUrl = decodeURIComponent(fileDownloadUrl);
  const startIndex = decodedUrl.indexOf("/o/") + 3;
  const endIndex = decodedUrl.indexOf("?");
  const filePath = decodedUrl.substring(startIndex, endIndex);

};

const FirebaseStorageService = {
  uploadFile,
  deleteFile,
};

export default FirebaseStorageService;