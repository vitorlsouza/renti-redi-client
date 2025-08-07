import { z } from "zod";

// User validation schemas
export const userFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  zipCode: z
    .string()
    .min(1, "ZIP code is required")
    .regex(
      /^\d{5}(-\d{4})?$/,
      "ZIP code must be in format 12345 or 12345-6789"
    ),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  zipCode: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Update user schema (for edit operations)
export const updateUserSchema = userFormSchema.partial();

// Infer types from schemas
export type UserFormData = z.infer<typeof userFormSchema>;
export type UserData = z.infer<typeof userSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
