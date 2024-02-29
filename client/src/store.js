// store.js
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./userSlice";
import registrationReducer from "./regSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    registration: registrationReducer,
  },
});

export default store;
