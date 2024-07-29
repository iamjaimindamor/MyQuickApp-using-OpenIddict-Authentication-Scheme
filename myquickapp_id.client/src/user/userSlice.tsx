import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import IAuthenticationDetails, { Roles } from "../types/auth.types"; // Define a type for the slice state

// Define the initial state using that type
export const initialState: IAuthenticationDetails = {
    firstname: "",
    lastname: "",
    email: "",
    rolesList: [""],
    uniqueID: "",
    phoneNumber: null,
    userName: "",
    loginProvider: null,
    createdAt: "",
    modifiedAt: "",
    isBlocked: false,
};

export const initialRoles: Roles = {
    id: "",
    name: "",
    normalizedName: "",
    concurrencyStamp: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAuthDetails(state, action: PayloadAction<IAuthenticationDetails>) {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});

export const { setAuthDetails } = userSlice.actions;

export default userSlice.reducer;