import axios from "axios";

const LOCK = "AIzaSyCROX8P0cpRjz8-DvuHh2IQUGQ8BZpILaE";

export async function logUserIn(email: string, password: string) {
  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${LOCK}`,
    {
      email,
      password,
      returnSecureToken: true,
    },
  );
  const userData = {
    token: response.data.idToken,
    userId: response.data.localId,
    name: response.data.displayName,
  };

  return userData;
}

export async function createUser(
  name: string,
  email: string,
  password: string,
) {
  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${LOCK}`,
    {
      displayName: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      password,
      returnSecureToken: true,
    },
  );
  const userData = {
    token: response.data.idToken,
    userId: response.data.localId,
    name: response.data.displayName,
    email: email,
  };

  return userData;
}
