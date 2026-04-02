import { api } from './api';
import type { User, UsersResponse, UserPayload } from '../features/users/usersTypes';

export const usersApi = {
  getUsers: async (limit = 12, skip = 0): Promise<UsersResponse> => {
    const { data } = await api.get(`/users?limit=${limit}&skip=${skip}`);
    return data;
  },

  getUserById: async (id: number): Promise<User> => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

 searchUsers: async (
  query: string,
  limit = 12,
  skip = 0
): Promise<UsersResponse> => {
  const { data } = await api.get(
    `/users/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
  );
  return data;
},

  addUser: async (payload: UserPayload): Promise<User> => {
    const { data } = await api.post('/users/add', payload);
    console.log('Data: ',data)
    return data;
  },

  updateUser: async (id: number, payload: Partial<UserPayload>): Promise<User> => {
    const { data } = await api.patch(`/users/${id}`, payload);
    return data;
  },

  deleteUser: async (id: number): Promise<{ id: number; isDeleted?: boolean }> => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};