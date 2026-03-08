import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    isLoading: false,
    activeRequests: 0,
  },
  reducers: {
    startLoading: (state) => {
      state.activeRequests += 1;
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.activeRequests = Math.max(0, state.activeRequests - 1);
      if (state.activeRequests === 0) {
        state.isLoading = false;
      }
    },
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
