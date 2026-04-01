import { createAsyncThunk } from '@reduxjs/toolkit';
import { usersApi } from '../../services/userApi';
import type { UserPayload } from './usersTypes';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ limit = 12, skip = 0 }: { limit?: number; skip?: number }) => {
    return usersApi.getUsers(limit, skip);
  }
);

export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async (query: string) => {
    return usersApi.searchUsers(query);
  }
);

export const addUser = createAsyncThunk(
  'users/addUser',
  async (payload: UserPayload) => {
    return usersApi.addUser(payload);
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, payload }: { id: number; payload: Partial<UserPayload> }) => {
    return usersApi.updateUser(id, payload);
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number) => {
    await usersApi.deleteUser(id);
    return id;
  }
);