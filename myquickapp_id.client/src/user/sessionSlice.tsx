import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ISessionState } from "../types/auth.types";

// Define the initial state using that type
const initialState: ISessionState = {
    isSessionExpired: false
};

export const setSessionSlice = createSlice({
    name: "setSession",
    initialState,
    reducers: {
        setSession(state, action: PayloadAction<ISessionState>) {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});

export const { setSession } = setSessionSlice.actions;

export default setSessionSlice.reducer;