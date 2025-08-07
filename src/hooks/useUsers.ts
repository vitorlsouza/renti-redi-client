import { useCallback } from "react";
import { useUserContext } from "../contexts/UserContext";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/api";
import type { User, CreateUserRequest, UpdateUserRequest } from "../types/user";

export const useUsers = () => {
  const { state, dispatch } = useUserContext();

  const fetchUsers = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const users = await getAllUsers();
      dispatch({ type: "SET_USERS", payload: users });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: (error as Error).message });
    }
  }, [dispatch]);

  const handleCreateUser = useCallback(
    async (userData: CreateUserRequest) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const newUser = await createUser(userData);
        dispatch({ type: "ADD_USER", payload: newUser });
        return newUser;
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: (error as Error).message });
        throw error;
      }
    },
    [dispatch]
  );

  const handleUpdateUser = useCallback(
    async (id: string, updates: UpdateUserRequest) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const updatedUser = await updateUser(id, updates);
        dispatch({ type: "UPDATE_USER", payload: updatedUser });
        return updatedUser;
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: (error as Error).message });
        throw error;
      }
    },
    [dispatch]
  );

  const handleDeleteUser = useCallback(
    async (id: string) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        await deleteUser(id);
        dispatch({ type: "DELETE_USER", payload: id });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: (error as Error).message });
        throw error;
      }
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, [dispatch]);

  const selectUser = useCallback(
    (user: User) => {
      dispatch({ type: "SET_SELECTED_USER", payload: user });
    },
    [dispatch]
  );

  return {
    users: state.users,
    selectedUser: state.selectedUser,
    loading: state.loading,
    error: state.error,
    fetchUsers,
    createUser: handleCreateUser,
    updateUser: handleUpdateUser,
    deleteUser: handleDeleteUser,
    clearError,
    selectUser,
  };
};
