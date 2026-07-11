import { z } from "zod";

export const brandSchema = z.object({
    name: z
        .string()
        .min(2, "Brand name must be at least 2 characters")
        .max(50, "Maximum 50 characters"),

    isActive: z.boolean(),

    logo: z.any().optional(),
});