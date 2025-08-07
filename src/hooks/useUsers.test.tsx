import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { UserProvider } from "../contexts/UserContext";
import { useUsers } from "./useUsers";
import * as apiService from "../services/api";
import type { User, CreateUserRequest, UpdateUserRequest } from "../types/user";

// Mock the API service
vi.mock("../services/api");

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    zipCode: "12345",
    latitude: 40.7128,
    longitude: -74.006,
    timezone: "America/New_York",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    zipCode: "54321",
    latitude: 34.0522,
    longitude: -118.2437,
    timezone: "America/Los_Angeles",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];

const wrapper = ({ children }: { children: ReactNode }) => (
  <UserProvider>{children}</UserProvider>
);

describe("useUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const { result } = renderHook(() => useUsers(), { wrapper });

      expect(result.current.users).toEqual([]);
      expect(result.current.selectedUser).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("fetchUsers", () => {
    it("should fetch users successfully", async () => {
      const getAllUsersMock = vi.mocked(apiService.getAllUsers);
      getAllUsersMock.mockResolvedValue(mockUsers);

      const { result } = renderHook(() => useUsers(), { wrapper });

      await act(async () => {
        await result.current.fetchUsers();
      });

      expect(result.current.users).toEqual(mockUsers);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(getAllUsersMock).toHaveBeenCalledOnce();
    });

    it("should handle fetch users error", async () => {
      const errorMessage = "Failed to fetch users";
      const getAllUsersMock = vi.mocked(apiService.getAllUsers);
      getAllUsersMock.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useUsers(), { wrapper });

      await act(async () => {
        await result.current.fetchUsers();
      });

      expect(result.current.users).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(getAllUsersMock).toHaveBeenCalledOnce();
    });

    it("should set loading state during fetch", async () => {
      const getAllUsersMock = vi.mocked(apiService.getAllUsers);
      getAllUsersMock.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve(mockUsers), 100))
      );

      const { result } = renderHook(() => useUsers(), { wrapper });

      act(() => {
        result.current.fetchUsers();
      });

      expect(result.current.loading).toBe(true);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      expect(result.current.loading).toBe(false);
    });
  });

  describe("createUser", () => {
    it("should create user successfully", async () => {
      const newUserData: CreateUserRequest = {
        name: "New User",
        zipCode: "99999",
      };

      const createdUser: User = {
        id: "3",
        name: "New User",
        zipCode: "99999",
        latitude: 25.7617,
        longitude: -80.1918,
        timezone: "America/Miami",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      };

      const createUserMock = vi.mocked(apiService.createUser);
      createUserMock.mockResolvedValue(createdUser);

      const { result } = renderHook(() => useUsers(), { wrapper });

      let returnedUser: User;
      await act(async () => {
        returnedUser = await result.current.createUser(newUserData);
      });

      expect(returnedUser!).toEqual(createdUser);
      expect(result.current.users).toContain(createdUser);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(createUserMock).toHaveBeenCalledWith(newUserData);
    });

    it("should handle create user error", async () => {
      const newUserData: CreateUserRequest = {
        name: "New User",
        zipCode: "99999",
      };

      const errorMessage = "Failed to create user";
      const createUserMock = vi.mocked(apiService.createUser);
      createUserMock.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useUsers(), { wrapper });

      await act(async () => {
        try {
          await result.current.createUser(newUserData);
        } catch (error) {
          expect((error as Error).message).toBe(errorMessage);
        }
      });

      expect(result.current.users).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(createUserMock).toHaveBeenCalledWith(newUserData);
    });
  });

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      const userId = "1";
      const updates: UpdateUserRequest = {
        name: "Updated Name",
      };

      const updatedUser: User = {
        ...mockUsers[0],
        name: "Updated Name",
        updatedAt: "2023-01-01T12:00:00Z",
      };

      const updateUserMock = vi.mocked(apiService.updateUser);
      updateUserMock.mockResolvedValue(updatedUser);

      const { result } = renderHook(() => useUsers(), { wrapper });

      // First add users to state
      await act(async () => {
        result.current.users.push(...mockUsers);
      });

      let returnedUser: User;
      await act(async () => {
        returnedUser = await result.current.updateUser(userId, updates);
      });

      expect(returnedUser!).toEqual(updatedUser);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(updateUserMock).toHaveBeenCalledWith(userId, updates);
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      const userId = "1";

      const deleteUserMock = vi.mocked(apiService.deleteUser);
      deleteUserMock.mockResolvedValue(undefined);

      const { result } = renderHook(() => useUsers(), { wrapper });

      await act(async () => {
        await result.current.deleteUser(userId);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(deleteUserMock).toHaveBeenCalledWith(userId);
    });

    it("should handle delete user error", async () => {
      const userId = "1";
      const errorMessage = "Failed to delete user";

      const deleteUserMock = vi.mocked(apiService.deleteUser);
      deleteUserMock.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useUsers(), { wrapper });

      await act(async () => {
        try {
          await result.current.deleteUser(userId);
        } catch (error) {
          expect((error as Error).message).toBe(errorMessage);
        }
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(deleteUserMock).toHaveBeenCalledWith(userId);
    });
  });
});
