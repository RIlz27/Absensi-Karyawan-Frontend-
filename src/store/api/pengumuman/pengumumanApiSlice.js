import { apiSlice } from "../apiSlice";

export const pengumumanApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPengumumanUser: builder.query({
      query: () => "/pengumuman",
      providesTags: ["Pengumuman"],
    }),
    
    getPengumumanAdmin: builder.query({
      query: () => "/admin/pengumuman",
      providesTags: ["Pengumuman"],
    }),

    createPengumuman: builder.mutation({
      query: (data) => ({
        url: "/admin/pengumuman",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Pengumuman"],
    }),

    updatePengumuman: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/pengumuman/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Pengumuman"],
    }),

    deletePengumuman: builder.mutation({
      query: (id) => ({
        url: `/admin/pengumuman/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pengumuman"],
    }),
  }),
});

export const {
  useGetPengumumanUserQuery,
  useGetPengumumanAdminQuery,
  useCreatePengumumanMutation,
  useUpdatePengumumanMutation,
  useDeletePengumumanMutation,
} = pengumumanApiSlice;
