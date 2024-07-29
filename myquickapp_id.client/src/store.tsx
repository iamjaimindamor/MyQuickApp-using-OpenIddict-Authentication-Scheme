import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import checkauthReducer from "./user/authenticationSlice";
import forceUpdateSlice from "./user/forceUpdateSlice";
import setSessionReducer from "./user/sessionSlice";
// ...

export const store = configureStore({
  reducer: {
    auth: userReducer,
    checkauthReducer,
    forceUpdateSlice,
    setSessionReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
