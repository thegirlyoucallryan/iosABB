import {fbApp} from './FirebaseConfig';
import {GoogleAuthProvider, getAuth, updateProfile} from 'firebase/auth'


const auth = fbApp.auth();
const update = getAuth()



const registerUser = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password)
}

const loginUser = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
}

const logoutUser = () => {
    return auth.signOut()
}

const logUserInWithToken = (token: string) => {
  return auth.signInWithCustomToken(token)
}

const sendPasswordResetEmail = (email) => {
    return auth.sendPasswordResetEmail(email)
}

const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return auth.signInWithPopup(provider)
}


const subscribeToAuthChanges = (handleAuthChange) => {
    auth.onAuthStateChanged((user) => {
        handleAuthChange(user)
    })
}

const updateUser = (userName: string) => {
        updateProfile(update.currentUser, {
            displayName: userName,
            // photoURL: photoURL
        })
    }


const getUsersProfile = () => {
    return update.currentUser.displayName
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