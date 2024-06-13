import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import bookSlice from "./reducers/bookSlice";
import storeSlice from "./reducers/storeSlice";

const store = configureStore({
    reducer:{
        user: authSlice,
        books: bookSlice,
        store: storeSlice
    },
})

export default store;