import { createSlice } from "@reduxjs/toolkit";
import { loadFromStorage } from "../thunks/loadFromStorage";

export const initialState = {
  user: null,
  role: null,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.role = null;
      state.error = null;
    },
    setAuthError(state, action) {
      state.error = action.payload;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFromStorage.fulfilled, (state, action) => {
      const session = action.payload.session;
      if (session && session.user && session.role) {
        state.user = session.user;
        state.role = session.role;
      }
    });
  },
});

export default authSlice.reducer;
