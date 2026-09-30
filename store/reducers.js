import { combineReducers } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import userReducer from './slices/userSlice';

const reducers = combineReducers({
  user: userReducer,
  app: appReducer,
});

export default reducers;
