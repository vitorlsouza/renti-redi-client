import { describe, it, expect, beforeEach, afterEach } from "vitest";
import MockAdapter from "axios-mock-adapter";
import api, { createUser, getAllUsers, updateUser, deleteUser } from "./api";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponse,
} from "@/types/user";

describe("API Service", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  describe("createUser", () => {
    it("should create a user successfully", async () => {
      const userData: CreateUserRequest = {
        name: "John Doe",
        zipCode: "12345",
      };

      const expectedUser: User = {
        id: "1",
        name: "John Doe",
        zipCode: "12345",
        latitude: 40.7128,
        longitude: -74.006,
        timezone: "America/New_York",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      };

      const response: ApiResponse<User> = {
        success: true,
        message: "User created successfully",
        data: expectedUser,
      };

      mock.onPost("/users").reply(200, response);

      const result = await createUser(userData);
      expect(result).toEqual(expectedUser);
    });

    it("should handle API errors", async () => {
      const userData: CreateUserRequest = {
        name: "John Doe",
        zipCode: "12345",
      };

      mock.onPost("/users").reply(400, {
        success: false,
        message: "Invalid data",
      });

      await expect(createUser(userData)).rejects.toThrow("Invalid data");
    });
  });

  describe("getAllUsers", () => {
    it("should fetch all users successfully", async () => {
      const users: User[] = [
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

      const response: ApiResponse<User[]> = {
        success: true,
        message: "Users fetched successfully",
        data: users,
      };

      mock.onGet("/users").reply(200, response);

      const result = await getAllUsers();
      expect(result).toEqual(users);
    });

    it("should return empty array when no data", async () => {
      const response: ApiResponse<User[]> = {
        success: true,
        message: "No users found",
        data: null as unknown as User[],
      };

      mock.onGet("/users").reply(200, response);

      const result = await getAllUsers();
      expect(result).toEqual([]);
    });
  });

  describe("updateUser", () => {
    it("should update a user successfully", async () => {
      const userId = "1";
      const updates: UpdateUserRequest = {
        name: "John Updated",
      };

      const updatedUser: User = {
        id: "1",
        name: "John Updated",
        zipCode: "12345",
        latitude: 40.7128,
        longitude: -74.006,
        timezone: "America/New_York",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T12:00:00Z",
      };

      const response: ApiResponse<User> = {
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      };

      mock.onPut(`/users/${userId}`).reply(200, response);

      const result = await updateUser(userId, updates);
      expect(result).toEqual(updatedUser);
    });
  });

  describe("deleteUser", () => {
    it("should delete a user successfully", async () => {
      const userId = "1";

      mock.onDelete(`/users/${userId}`).reply(200);

      await expect(deleteUser(userId)).resolves.not.toThrow();
    });
  });
});
