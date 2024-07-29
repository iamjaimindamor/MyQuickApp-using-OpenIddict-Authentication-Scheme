import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IAuthenticationState } from "../types/auth.types";

// Define the initial state using that type
const initialState: IAuthenticationState = {
    isAuthenticated: false
};

export const checkauthSlice = createSlice({
    name: "CheckAuth",
    initialState,
    reducers: {
        CheckAuth(state, action: PayloadAction<IAuthenticationState>) {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});

export const { CheckAuth } = checkauthSlice.actions;

export default checkauthSlice.reducer;