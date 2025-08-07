import axios from "axios";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponse,
} from "@/types/user";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message);
  }
);

export const createUser = async (
  userData: CreateUserRequest
): Promise<User> => {
  const response = await api.post<ApiResponse<User>>("/users", userData);
  return response.data.data || null;
};

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get<ApiResponse<User[]>>("/users");
  return response.data.data || [];
};

export const updateUser = async (
  id: string,
  updates: UpdateUserRequest
): Promise<User> => {
  const response = await api.put<ApiResponse<User>>(`/users/${id}`, updates);
  return response.data.data || null;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export default api;
