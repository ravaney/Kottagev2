import { createSlice } from "@reduxjs/toolkit";
import { IAddress } from "../../public/QuickType";
import {
  addImagesAsync,
  addPropertyAsync,
  getMyPropertiesAsync,
} from "./thunks";
import { ILoadingState } from "./userSlice";
import { RootState } from "./store";
import { useAppSelector } from "./hooks";

export interface Kottage {
  name?: string;
  description?: string;
  location?: string;
  price?: number;
  address?: IAddress;
  images?: {} | null;
  rooms?: number;
  bathrooms?: number;
  beds?: number;
  guests?: number;
  phone?: string;
  id: string;
}

interface propertyState {
  property: Kottage | null;
  allMyProperties: Kottage[];
  loading: ILoadingState;
}

const propertyInitialState: Kottage | null = null;

const initialState: propertyState = {
  property: propertyInitialState,
  allMyProperties: [],
  loading: "idle",
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addPropertyAsync.pending, (state, action) => {
      console.log("pending");
    });
    builder.addCase(addPropertyAsync.fulfilled, (state, action) => {
      console.log("fulfilled");
    });
    builder.addCase(addPropertyAsync.rejected, (state, action) => {
      console.log("rejected");
    });
    builder.addCase(getMyPropertiesAsync.pending, (state, action) => {
      console.log("pending");
    });
    builder.addCase(getMyPropertiesAsync.fulfilled, (state, action) => {
      console.log("fulfilled");
      //set the payload to allMyProperties
      console.log(action.payload);
      state.allMyProperties = action.payload;
    });
    builder.addCase(getMyPropertiesAsync.rejected, (state, action) => {
      console.log("rejected");
    });
    builder.addCase(addImagesAsync.pending, (state, action) => {
      console.log("pending");
    });
    builder.addCase(addImagesAsync.fulfilled, (state, action) => {
      console.log("fulfilled");
      //update the images array of the property
    });
    builder.addCase(addImagesAsync.rejected, (state, action) => {
      console.log("rejected");
    });
  },
});

export default propertySlice.reducer;
export const selectAddPropertyState = (state: RootState) => state.property;
export const usePropertyState = () => useAppSelector(selectAddPropertyState);
