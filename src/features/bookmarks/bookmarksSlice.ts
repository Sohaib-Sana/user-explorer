import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loginSuccess, logout } from '../auth/authSlice';
import { deleteUser } from '../users/usersThunks';

interface BookmarksState {
  ids: number[];
  byUser: Record<string, number[]>;
}

const STORAGE_KEY = 'bookmarks';

const loadBookmarks = (): Record<string, number[]> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};

    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const persist = (byUser: Record<string, number[]>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(byUser));
};

const initialByUser = loadBookmarks();

// Check if there's stored auth data and load bookmarks for that user
const getInitialIds = (): number[] => {
  try {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      if (authData.isAuthenticated && authData.user?.email) {
        const email = authData.user.email.trim().toLowerCase();
        return initialByUser[email] || [];
      }
    }
  } catch {
    // Ignore errors
  }
  return [];
};

const initialState: BookmarksState = {
  ids: getInitialIds(),
  byUser: initialByUser,
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    toggleBookmark: (
      state,
      action: PayloadAction<{ userId: number; email: string }>
    ) => {
      const { userId, email } = action.payload;
      const key = email.trim().toLowerCase();

      const currentIds = state.byUser[key] || [];
      const exists = currentIds.includes(userId);

      const nextIds = exists
        ? currentIds.filter((id) => id !== userId)
        : [...currentIds, userId];

      state.byUser[key] = nextIds;
      state.ids = nextIds;

      persist(state.byUser);
    },
    clearBookmarks: (state) => {
      state.ids = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginSuccess, (state, action) => {
        const email = action.payload.email.trim().toLowerCase();
        state.ids = state.byUser[email] || [];
      })
      .addCase(logout, (state) => {
        state.ids = [];
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const deletedUserId = action.payload;

        Object.keys(state.byUser).forEach((email) => {
          state.byUser[email] = state.byUser[email].filter(
            (id) => id !== deletedUserId
          );
        });

        state.ids = state.ids.filter((id) => id !== deletedUserId);
        persist(state.byUser);
      });
  },
});

export const { toggleBookmark, clearBookmarks } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;