import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  token: null,
  ipAddress: null,
  userStore: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setIpAddress(state, action) {
      state.ipAddress = action.payload;
    },
    setUserStore(state, action) {
      state.userStore = action.payload;
    },
  },
});

export const {
  setUserInfo,
  setToken,
  setIpAddress,
  setUserStore,
} = userSlice.actions;

export default userSlice.reducer;
