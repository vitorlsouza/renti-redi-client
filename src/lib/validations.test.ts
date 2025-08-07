import { describe, it, expect } from "vitest";
import { userFormSchema, userSchema, updateUserSchema } from "./validations";

describe("validations", () => {
  describe("userFormSchema", () => {
    it("should validate valid user form data", () => {
      const validData = {
        name: "John Doe",
        zipCode: "12345",
      };

      const result = userFormSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it("should validate zipCode with extended format", () => {
      const validData = {
        name: "John Doe",
        zipCode: "12345-6789",
      };

      const result = userFormSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it("should reject empty name", () => {
      const invalidData = {
        name: "",
        zipCode: "12345",
      };

      expect(() => userFormSchema.parse(invalidData)).toThrow(
        "Name is required"
      );
    });

    it("should reject name with invalid characters", () => {
      const invalidData = {
        name: "John123",
        zipCode: "12345",
      };

      expect(() => userFormSchema.parse(invalidData)).toThrow(
        "Name can only contain letters and spaces"
      );
    });

    it("should reject invalid zipCode format", () => {
      const invalidData = {
        name: "John Doe",
        zipCode: "1234",
      };

      expect(() => userFormSchema.parse(invalidData)).toThrow(
        "ZIP code must be in format 12345 or 12345-6789"
      );
    });

    it("should reject empty zipCode", () => {
      const invalidData = {
        name: "John Doe",
        zipCode: "",
      };

      expect(() => userFormSchema.parse(invalidData)).toThrow(
        "ZIP code is required"
      );
    });
  });

  describe("userSchema", () => {
    it("should validate complete user data", () => {
      const validUser = {
        id: "123",
        name: "John Doe",
        zipCode: "12345",
        latitude: 40.7128,
        longitude: -74.006,
        timezone: "America/New_York",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      };

      const result = userSchema.parse(validUser);
      expect(result).toEqual(validUser);
    });
  });

  describe("updateUserSchema", () => {
    it("should validate partial user data", () => {
      const partialUpdate = {
        name: "Jane Doe",
      };

      const result = updateUserSchema.parse(partialUpdate);
      expect(result).toEqual(partialUpdate);
    });

    it("should validate empty object", () => {
      const emptyUpdate = {};

      const result = updateUserSchema.parse(emptyUpdate);
      expect(result).toEqual(emptyUpdate);
    });

    it("should validate both fields", () => {
      const fullUpdate = {
        name: "Jane Doe",
        zipCode: "54321",
      };

      const result = updateUserSchema.parse(fullUpdate);
      expect(result).toEqual(fullUpdate);
    });
  });
});
