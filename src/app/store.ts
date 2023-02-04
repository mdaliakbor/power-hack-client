import { configureStore } from "@reduxjs/toolkit";
import authApi from "../feature/api/authApi";
import billApi from "../feature/api/billApi";
import userReducer from "../feature/slices/authSlice";


const store = configureStore({
    reducer: {
        auth: userReducer,
        [authApi.reducerPath]: authApi.reducer,
        [billApi.reducerPath]: billApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        authApi.middleware,
        billApi.middleware,
    ),
    devTools: true
})

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch