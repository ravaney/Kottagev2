import {   createSlice } from "@reduxjs/toolkit";
import { createAccountAsync,  getUserAsync,  loginAsync, signOutAsync, updateProfileAsync } from "./thunks";
import { RootState } from "./store";
import { useAppSelector } from "./hooks";
import { IUser } from "../../public/QuickType";

export type ILoadingState = 'idle' | 'pending' | 'succeeded' | 'failed'
interface userState {
    user:IUser | null;
    loading: ILoadingState;
    loginError:string,
    accountCreationError:string,
}


//create a null initial state for user to be used in the userSlice
const userInitialState:IUser | null = null

const initialState:userState  = {    
    user:userInitialState,
    loading:'idle',
    loginError:'',
    accountCreationError:'',
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        login:(state, action) =>{
            state.user = action.payload
        },
        logout:(state) =>{
            state.user = null
        }

    },
    extraReducers:(builder) => {
        builder.addCase(getUserAsync.pending, (state,action)=>{
            console.log('pending')
            state.loading = 'pending'
        })
        builder.addCase(getUserAsync.fulfilled, (state,action)=>{   
            state.loading = 'succeeded'
            state.user = action.payload
        })
        builder.addCase(loginAsync.pending, (state,action)=>{
            console.log('pending')
            state.loading = 'pending'
        })
        builder.addCase(loginAsync.fulfilled, (state,action)=>{
            state.loading = 'succeeded'
            state.user = action.payload
            state.loginError = ''
        })  
        builder.addCase(loginAsync.rejected, (state,action)=>{
            state.loginError = action.error.message as string
            state.loading = 'failed'
            console.log('failed')
        })
        builder.addCase(signOutAsync.pending, (state,action)=>{
            console.log('pending')
            state.loading = 'pending'
        })
        builder.addCase(signOutAsync.fulfilled, (state,action)=>{
            console.log('logged out')
            state.user = null
            state.loading = 'succeeded'
        })  
        builder.addCase(signOutAsync.rejected, (state,action)=>{
            console.log('failed')
            state.loading = 'failed'
        })
        builder.addCase(updateProfileAsync.pending, (state,action)=>{
            console.log('pending')
            state.loading = 'pending'
        })
        builder.addCase(updateProfileAsync.fulfilled, (state,ation)=>{
            console.log('Profile updated')
            state.loading = 'succeeded'
        })  
        builder.addCase(updateProfileAsync.rejected, (state,action)=>{
            console.log('failed')
            state.loading = 'failed'
        })
        builder.addCase(createAccountAsync.pending, (state,action)=>{
            console.log('pending')
            state.loading = 'pending'
        })
        builder.addCase(createAccountAsync.fulfilled, (state,action)=>{
            console.log('Account created')
            state.loading = 'succeeded'
        })
        builder.addCase(createAccountAsync.rejected, (state,action)=>{
            console.log('failed')
            state.loading = 'failed'
            state.accountCreationError = action.error.message as string
        })
        },
        
    
});
export const {login, logout} = userSlice.actions
export const selectUserState = (state:RootState)=> state.user
export default userSlice.reducer;
export const useUserState = () => useAppSelector(selectUserState)





