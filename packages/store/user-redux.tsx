import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Apparatus } from "./tricks-redux";

interface UserType {
    apparatus: Apparatus,
}

const userSlice = createSlice({
    name: "userInfo",
    initialState: {
        apparatus: null as Apparatus
    }, 
    reducers: {
        setCurrentApparatus: (state, action: PayloadAction<Apparatus>) => {
            console.log(action)
            state.apparatus = action.payload
        }
    }

})

const slice = userSlice.actions;

export const setCurrentApparatus = slice.setCurrentApparatus;

export default userSlice.reducer;