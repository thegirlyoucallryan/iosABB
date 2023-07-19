import {fbApp} from './FirebaseConfig';
import {GoogleAuthProvider, browserLocalPersistence, getAuth, setPersistence, updateProfile} from 'firebase/auth'


export const auth = fbApp.auth();
const update = getAuth()

// setPersistence(auth, browserLocalPersistence);

const registerUser = (email: string, password: string) => {
    return auth.createUserWithEmailAndPassword(email, password)
}

const loginUser = (email: string, password: string) => {
    return auth.signInWithEmailAndPassword(email, password);
}

const logoutUser = () => {
    return auth.signOut()
}

const logUserInWithToken = (token:any) => {
  return auth.signInWithCustomToken(token)
}

const sendPasswordResetEmail = (email: string) => {
    return auth.sendPasswordResetEmail(email)
}

const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return auth.signInWithPopup(provider)
}


const subscribeToAuthChanges = (handleAuthChange: (user: any) => void) => {
    auth.onAuthStateChanged((user) => {
       if(user) {
        handleAuthChange(user)
       } else{

       }
    })
}

const updateUser = (userName: string) => {
        updateProfile(update.currentUser, {
            displayName: userName,
            // photoURL: photoURL
        })
    }


const getUsersProfile = () => {
    return update.currentUser?.displayName
}


const FirebaseAuthSvc = {
    registerUser,
    loginUser,
    logoutUser,
    sendPasswordResetEmail,
    loginWithGoogle,
    subscribeToAuthChanges,
    updateUser,
    getUsersProfile,
    logUserInWithToken,

}

export default FirebaseAuthSvc;