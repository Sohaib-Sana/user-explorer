import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface BookmarksState {
  ids: number[];
}

const stored = localStorage.getItem('bookmarks');

const initialState: BookmarksState = {
  ids: stored ? JSON.parse(stored) : [],
};

const persist = (ids: number[]) => {
  localStorage.setItem('bookmarks', JSON.stringify(ids));
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    toggleBookmark: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const exists = state.ids.includes(id);

      state.ids = exists
        ? state.ids.filter((item) => item !== id)
        : [...state.ids, id];

      persist(state.ids);
    },
    clearBookmarks: (state) => {
      state.ids = [];
      persist([]);
    },
  },
});

export const { toggleBookmark, clearBookmarks } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;