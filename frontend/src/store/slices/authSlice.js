import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isCheckingAuth: true,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isCheckingAuth = false;
        },

        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isCheckingAuth = false;
        },

        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.isCheckingAuth = false;
        },

        finishChecking: (state) => {
            state.isCheckingAuth = false;
        },
    },
});

export const {
    loginSuccess,
    setUser,
    logout,
    finishChecking,
} = authSlice.actions;

export default authSlice.reducer;