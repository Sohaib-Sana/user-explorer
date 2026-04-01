import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from './usersTypes';
import { addUser, deleteUser, fetchUsers, searchUsers, updateUser } from './usersThunks';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface UsersState {
  items: User[];
  total: number;
  limit: number;
  skip: number;
  query: string;
  selectedUser: User | null;
  fetchStatus: Status;
  addStatus: Status;
  updateStatus: Status;
  deleteStatus: Status;
  error: string | null;
}


const initialState: UsersState = {
  items: [],
  total: 0,
  limit: 12,
  skip: 0,
  query: '',
  selectedUser: null,
  fetchStatus: 'idle',
  addStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    resetMutationStatuses: (state) => {
      state.addStatus = 'idle';
      state.updateStatus = 'idle';
      state.deleteStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.items = action.payload.users;
        state.total = action.payload.total;
        state.skip = action.payload.skip;
        state.limit = action.payload.limit;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.error.message || 'Failed to fetch users';
      })

      .addCase(searchUsers.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.items = action.payload.users;
        state.total = action.payload.total;
        state.skip = action.payload.skip;
        state.limit = action.payload.limit;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.error.message || 'Failed to search users';
      })

      .addCase(addUser.pending, (state) => {
        state.addStatus = 'loading';
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.addStatus = 'succeeded';
        state.items = [action.payload, ...state.items];
      })
      .addCase(addUser.rejected, (state, action) => {
        state.addStatus = 'failed';
        state.error = action.error.message || 'Failed to add user';
      })

      .addCase(updateUser.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.items = state.items.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.error.message || 'Failed to update user';
      })

      .addCase(deleteUser.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.items = state.items.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.error = action.error.message || 'Failed to delete user';
      });
  },
});

export const { setSelectedUser, setQuery, resetMutationStatuses } = usersSlice.actions;
export default usersSlice.reducer;