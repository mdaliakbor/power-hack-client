import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const billApi = createApi({
    reducerPath: 'billApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_BASE_URL,
        credentials: "include",
    }),
    tagTypes: ["bills"],
    endpoints: (builder) => ({
        // GET ALL BILL
        getAllBill: builder.query({
            query: () => ({
                url: `api/billing-list`,
                method: "GET",
            }),
            providesTags: ["bills"]
        }),
        // GET ALL BILL
        getBillWithQuery: builder.mutation({
            query: (query: any) => ({
                url: `api/billing-list?${query}`,
                method: "GET",
            }),
        }),
        // ADD A BILL
        addBill: builder.mutation({
            query: (body: {
                fullName: string
                email: string
                phone: string
                payableAmount: string
            }) => ({
                url: "api/add-billing",
                method: "POST",
                body: body
            }),
            invalidatesTags: ["bills"]
        }),
        // UPDATE A BILL
        updateBill: builder.mutation({
            query: (body: {
                id: string
                data: {
                    fullName: string
                    email: string
                    phone: string
                    payableAmount: string
                }
            }) => ({
                url: `api/update-billing/${body.id}`,
                method: "PATCH",
                body: body.data
            }),
            invalidatesTags: ["bills"]
        }),
        // DELETE A BILL
        deleteBill: builder.mutation({
            query: (id: string) => ({
                url: `api/delete-billing/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["bills"]
        })
    }),
})

export default billApi;

export const {
    useGetAllBillQuery,
    useGetBillWithQueryMutation,
    useAddBillMutation,
    useUpdateBillMutation,
    useDeleteBillMutation
} = billApi;