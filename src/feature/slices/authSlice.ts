import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
    username: string
    email: string
    avatar: string
}

type InitialState = {
    user: User,
    refresh: boolean
}

const initialState: InitialState = {
    user: {
        username: "",
        email: "",
        avatar: ""
    },
    refresh: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.user = action.payload
            state.refresh = true
        },
        logout: (state) => {
            state.user.username = ""
            state.user.email = ""
            state.user.avatar = ""
        },
        refresher: (state) => {
            state.refresh = true
        }
    }
})

export default authSlice.reducer;
export const { login, logout, refresher } = authSlice.actions;