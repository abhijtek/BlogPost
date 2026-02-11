import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData : null,
}
const authSlice = createSlice({
  name:"auth",
  initialState,
  reducers:{
    login:(state,action)=>{
        state.status = true;
        console.log("auth slice login action:",action);
        state.userData = action.payload.userData; 
    },
    logout:(state)=>{
        state.status = false;
        state.userData = null;
    },
    setUser:(state,action)=>{
      state.userData = action.payload.userData;
    }
  }
});

export const {login,logout,setUser} = authSlice.actions;
export default authSlice.reducer;
