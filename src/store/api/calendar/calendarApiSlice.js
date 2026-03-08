import { apiSlice } from "../apiSlice";

export const calendarApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCalendarData: builder.query({
      query: ({ month, year }) => `/admin/calendar?month=${month}&year=${year}`,
      providesTags: ["Calendar"],
    }),
    addBypass: builder.mutation({
      query: (data) => ({
        url: "/admin/bypass",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Calendar", "Point"],
    }),
  }),
});

export const { useGetAdminCalendarDataQuery, useAddBypassMutation } = calendarApiSlice;
