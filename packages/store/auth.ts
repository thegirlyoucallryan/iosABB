import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'



interface authState {
  token: string,
  userId: string,
  userName: string,
  isAuthenticated: boolean,
}

type AuthPayload = {
  token: string,
  userId: string,
  userName: string 
}

type LogoutPayload = {
  token: string,
  isAuthenticated: boolean
}

const authSlice = createSlice({
  name: "authentication",
  initialState: {
    token: "",
    userId: "",
    userName: "",
    isAuthenticated: false,
  },
  reducers: {
    authenticate: (state, payload: PayloadAction<AuthPayload>) => {
      state.token = payload.payload.token;
      state.userId = payload.payload.userId;
      state.userName = payload.payload.userName;

      state.isAuthenticated = true;
      AsyncStorage.setItem("ABB_token", payload.payload.token);
      AsyncStorage.setItem("ABB_userId", payload.payload.userId);
    },

    logout: (state, action: PayloadAction<LogoutPayload>) => {
      state.token = action.payload.token;
      state.isAuthenticated = false;
      AsyncStorage.removeItem("token");
    },
  },
});

export const authenticate = authSlice.actions.authenticate;
export const logout = authSlice.actions.logout;
export default authSlice.reducer;
