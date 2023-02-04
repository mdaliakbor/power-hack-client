import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_BASE_URL,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        // REGISTRATION
        registration: builder.mutation({
            query: (body: {
                username: string
                email: string
                password: string
                confirmPassword: string
            }) => ({
                url: "/api/registration",
                method: "POST",
                body: body
            })
        }),
        // LOGIN
        login: builder.mutation({
            query: (body: { email: string, password: string }) => ({
                url: "/api/login",
                method: "POST",
                body: body,
            })
        }),
        // GET USER
        getUser: builder.query({
            query: () => ({
                url: "/api/refresh",
                method: "POST"
            })
        }),
        // LOG OUT
        logout: builder.mutation({
            query: () => ({
                url: "/api/logout",
                method: "POST",
            })
        }),
    }),
})

export default authApi;

export const {
    useRegistrationMutation,
    useLoginMutation,
    useGetUserQuery,
    useLogoutMutation
} = authApi;