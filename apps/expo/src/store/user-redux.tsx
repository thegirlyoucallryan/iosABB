import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: "userInfo",
    initialState: {
        apparatus: ''
    }, 
    reducers: {
        setCurrentApparatus: (state, action) => {
            console.log(action)
            state.apparatus = action.payload
        }
    }

})

const slice = userSlice.actions;

export const setCurrentApparatus = slice.setCurrentApparatus;

export default userSlice.reducer;