


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/storage";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
 const firebaseConfig = {
  apiKey: "AIzaSyCROX8P0cpRjz8-DvuHh2IQUGQ8BZpILaE",
  authDomain: "aerial-blackbook.firebaseapp.com",
  databaseURL: "https://aerial-blackbook-default-rtdb.firebaseio.com",
  projectId: "aerial-blackbook",
  storageBucket: "aerial-blackbook.appspot.com",
  messagingSenderId: "388755201736",
  appId: "1:388755201736:web:f7348ef5d171897e378ffd"
  };
  
  // Initialize Firebase
 export const fbApp = firebase.initializeApp(firebaseConfig);
  

  // Initialize Cloud Storage and get a reference to the service
 export const storage = firebase.storage();
