import { apiSlice } from "../apiSlice";

export const pointApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query({
      query: (limit = 10) => `/leaderboard?limit=${limit}`,
      providesTags: ["Point"],
    }),
    adjustPoints: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}/points`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Point"],
    }),
  }),
});

export const {
  useGetLeaderboardQuery,
  useAdjustPointsMutation,
} = pointApiSlice;
