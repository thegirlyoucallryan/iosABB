
import { storage } from "./FirebaseConfig";



const uploadFile = (file: Blob, filePath: string) => {
 if(!file){
  return
 }

 const storageRef = storage.ref()
 const imageRef = storageRef.child(filePath)
  const uploadTask =  imageRef.put(file).then((snapshot) => {
    const url = snapshot.ref.getDownloadURL()
     return url
    })

    return uploadTask

   
  }


//modular
    // if(!file) return
    // const storageRef = getStorage()
  
    // const imageRef = ref(storageRef, filePath)
    //   const uploadTask = uploadBytesResumable(imageRef, file).then((snapshot) => {
    //    const url = getDownloadURL(snapshot.ref) 
  
    //    return url
    //   })



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

  


 const FirebaseStorage = {
   uploadFile
}

export default FirebaseStorage;