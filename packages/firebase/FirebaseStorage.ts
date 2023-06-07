import { fbApp,storage } from "./FirebaseConfig";
import { getStorage, ref, getDownloadURL, uploadBytes, uploadBytesResumable } from "firebase/storage";


const uploadFile = (file, filePath, progressCallback) => {
  if(!file) return
  const storageRef = getStorage()
  const metadata = {
    contentType: 'image/png',
  };
  const imageRef = ref(storageRef, filePath)
    const uploadTask = uploadBytesResumable(imageRef, file, metadata).then((snapshot) => {
     const url = getDownloadURL(snapshot.ref) 

     return url
    })

    return uploadTask

    // uploadTask.on(
    //     'state_changed',
    //     (snapshot) => {
    //         const progress = Math.round(
    //             (snapshot.bytesTransferred/snapshot.totalBytes) * 100
    //         )
    //         progressCallback(progress)
    //     },
    //     (error) => {
    //         throw error;
    //     },
       
      
    // )

  
   
}


 const FirebaseStorage = {
   uploadFile
}

export default FirebaseStorage;