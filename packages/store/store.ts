
import { ThunkMiddleware, configureStore } from "@reduxjs/toolkit";
import blackBookReducer from './tricks-redux';
import userReducer from "./user-redux";
import thunk from "redux-thunk";
import authReducer from "./auth";

export const store = configureStore({
    reducer: {
        user: userReducer,
        tricks: blackBookReducer,
        favorites: blackBookReducer,
        complete: blackBookReducer,
        isAuthenticated: authReducer,
        token: authReducer,
        name: authReducer,
        userId: authReducer,
    },
    middleware: [thunk  ],

})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch