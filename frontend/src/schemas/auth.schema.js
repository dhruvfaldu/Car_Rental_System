import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(3, "Full name is required"),

        email: z
            .string()
            .email("Invalid email"),

        phone: z
            .string()
            .min(10, "Phone number must be at least 10 digits")
            .max(15),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters"),

        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });