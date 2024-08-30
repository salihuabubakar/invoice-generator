import { configureStore, combineReducers } from '@reduxjs/toolkit';
// Import your slices here
import ducumentsReducer from './slices/documentsSlice';
import modalReducer from './slices/modalSlice';
import profileModalSlice from './slices/profileModalSlice';
import profileSlice from './slices/profileSlice';

const rootReducer = combineReducers({
  ducuments: ducumentsReducer,
  modal: modalReducer,
  profileModal: profileModalSlice,
  profile: profileSlice
});

export const store = configureStore({
  reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
