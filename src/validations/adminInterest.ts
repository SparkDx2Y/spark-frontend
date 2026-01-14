
import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters")
    .max(30, "Category name must be less than 30 characters")
    .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
});

export const createInterestSchema = z.object({
  name: z.string().trim().min(2, "Interest name must be at least 2 characters")
    .max(30, "Interest name must be less than 30 characters")
    .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed"),
  categoryId: z.string().min(1, "Please select a category")
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateInterestInput = z.infer<typeof createInterestSchema>;
