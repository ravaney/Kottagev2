import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import propertyReducer from "./propertySlice";

export const store = configureStore({
    reducer:{
        user:userReducer,
        property:propertyReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

