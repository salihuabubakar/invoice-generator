import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
};

const profileModalSlice = createSlice({
  name: "profileModal",
  initialState,
  reducers: {
    openProfile: (state) => {
      state.open = true;
    },
    closeProfile: (state) => {
      state.open = false;
    },
  },
});

export const { openProfile, closeProfile } = profileModalSlice.actions;

export default profileModalSlice.reducer;
