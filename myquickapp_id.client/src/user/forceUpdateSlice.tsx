import { createSlice } from "@reduxjs/toolkit";
import { IUpdateTheGlobalState } from "../types/auth.types";

const initialState: IUpdateTheGlobalState = {
    forceUpdate: false,
};

export const forceUpadateSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        SetForceUpdate: (state) => {
            state.forceUpdate = !state.forceUpdate;
        },
    },
});

export const { SetForceUpdate } = forceUpadateSlice.actions;

export default forceUpadateSlice.reducer;