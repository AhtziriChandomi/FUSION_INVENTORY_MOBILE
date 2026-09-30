import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: true,
  forceOffline: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsConnected(state, action) {
      state.isConnected = action.payload;
    },
    setForceOffline(state, action) {
      state.forceOffline = action.payload;
    },
    resetNetworkState(state) {
      state.isConnected = true;
      state.forceOffline = false;
    },
  },
});

export const {
  setIsConnected,
  setForceOffline,
  resetNetworkState,
} = appSlice.actions;

export default appSlice.reducer;
