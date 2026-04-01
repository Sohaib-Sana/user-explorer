import { configureStore } from '@reduxjs/toolkit';
import  authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice';
import bookmarksReducer from '../features/bookmarks/bookmarksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    bookmarks: bookmarksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;