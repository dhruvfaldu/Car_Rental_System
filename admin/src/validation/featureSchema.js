import { z } from "zod";

export const featureSchema = z.object({
    name: z
        .string()
        .min(2, "Feature name must be at least 2 characters")
        .max(50, "Maximum 50 characters"),
    icon: z
        .string()
        .min(1, "Please select or type an icon name"),
    description: z
        .string()
        .max(250, "Maximum 250 characters")
        .optional()
        .or(z.literal("")),
    isActive: z.boolean(),
});
