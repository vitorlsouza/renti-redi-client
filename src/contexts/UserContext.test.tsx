import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { UserProvider, useUserContext } from "./UserContext";
import type { User } from "../types/user";

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

describe("UserContext", () => {
  describe("useUserContext", () => {
    it("should provide initial state", () => {
      const { result } = renderHook(() => useUserContext(), { wrapper });

      expect(result.current.state.users).toEqual([]);
      expect(result.current.state.selectedUser).toBeNull();
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBeNull();
      expect(typeof result.current.dispatch).toBe("function");
    });
  });

  describe("userReducer actions", () => {
    it("should handle SET_LOADING", () => {
      const { result } = renderHook(() => useUserContext(), { wrapper });

      act(() => {
        result.current.dispatch({ type: "SET_LOADING", payload: true });
      });

      expect(result.current.state.loading).toBe(true);

      act(() => {
        result.current.dispatch({ type: "SET_LOADING", payload: false });
      });

      expect(result.current.state.loading).toBe(false);
    });

    it("should handle SET_ERROR", () => {
      const { result } = renderHook(() => useUserContext(), { wrapper });
      const errorMessage = "Something went wrong";

      act(() => {
        result.current.dispatch({ type: "SET_LOADING", payload: true });
      });

      act(() => {
        result.current.dispatch({ type: "SET_ERROR", payload: errorMessage });
      });

      expect(result.current.state.error).toBe(errorMessage);
      expect(result.current.state.loading).toBe(false);

      act(() => {
        result.current.dispatch({ type: "SET_ERROR", payload: null });
      });

      expect(result.current.state.error).toBeNull();
    });

    it("should handle SET_USERS", () => {
      const { result } = renderHook(() => useUserContext(), { wrapper });

      act(() => {
        result.current.dispatch({ type: "SET_LOADING", payload: true });
      });

      act(() => {
        result.current.dispatch({ type: "SET_USERS", payload: mockUsers });
      });

      expect(result.current.state.users).toEqual(mockUsers);
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBeNull();
    });

    it("should handle SET_SELECTED_USER", () => {
      const { result } = renderHook(() => useUserContext(), { wrapper });
      const userToSelect = mockUsers[0];

      act(() => {
        result.current.dispatch({
          type: "SET_SELECTED_USER",
          payload: userToSelect,
        });
      });

      expect(result.current.state.selectedUser).toEqual(userToSelect);

      act(() => {
        result.current.dispatch({ type: "SET_SELECTED_USER", payload: null });
      });

      expect(result.current.state.selectedUser).toBeNull();
    });

    it("should handle ADD_USER", () => {
      const { result } = renderHook(() => useUserContext(), { wrapper });
      const newUser = mockUsers[0];

      act(() => {
        result.current.dispatch({ type: "SET_LOADING", payload: true });
      });

      act(() => {
        result.current.dispatch({ type: "ADD_USER", payload: newUser });
      });

      expect(result.current.state.users).toContain(newUser);
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBeNull();
    });

    it("should handle UPDATE_USER", () => {
      const { result } = renderHook(() => useUserContext(), { wrapper });

      // First set users
      act(() => {
        result.current.dispatch({ type: "SET_USERS", payload: mockUsers });
      });

      // Set selected user
      act(() => {
        result.current.dispatch({
          type: "SET_SELECTED_USER",
          payload: mockUsers[0],
        });
      });

      const updatedUser: User = {
        ...mockUsers[0],
        name: "Updated Name",
        updatedAt: "2023-01-01T12:00:00Z",
      };

      act(() => {
        result.current.dispatch({ type: "UPDATE_USER", payload: updatedUser });
      });

      expect(result.current.state.users[0]).toEqual(updatedUser);
      expect(result.current.state.selectedUser).toEqual(updatedUser);
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBeNull();
    });

    it("should handle DELETE_USER", () => {
      const { result } = renderHook(() => useUserContext(), { wrapper });

      // First set users
      act(() => {
        result.current.dispatch({ type: "SET_USERS", payload: mockUsers });
      });

      const userIdToDelete = mockUsers[0].id;

      act(() => {
        result.current.dispatch({
          type: "DELETE_USER",
          payload: userIdToDelete,
        });
      });

      expect(result.current.state.users).not.toContain(mockUsers[0]);
      expect(result.current.state.users).toContain(mockUsers[1]);
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBeNull();
    });
  });
});
