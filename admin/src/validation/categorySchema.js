import { z } from "zod";

export const categorySchema = z.object({
    name: z
        .string()
        .min(2, "Category name must be at least 2 characters")
        .max(50, "Maximum 50 characters"),
    description: z
        .string()
        .max(250, "Maximum 250 characters")
        .optional()
        .or(z.literal("")),
    isActive: z.boolean(),
    image: z.any().optional(),
});
