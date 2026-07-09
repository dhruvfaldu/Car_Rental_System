import { z } from "zod";

export const bookingSchema = z
    .object({
        pickupDate: z.string().min(1, "Pickup date is required"),

        returnDate: z.string().min(1, "Return date is required"),

        pickupLocation: z
            .string()
            .min(3, "Pickup location is required"),

        dropLocation: z
            .string()
            .min(3, "Drop location is required"),

        paymentMethod: z.enum(["Online", "Cash", "Card"]),

        notes: z.string().optional(),
    })
    .refine(
        (data) =>
            new Date(data.returnDate) >
            new Date(data.pickupDate),
        {
            message: "Return date must be after pickup date",
            path: ["returnDate"],
        }
    );