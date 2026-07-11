import { z } from "zod";

export const carSchema = z.object({
    name: z.string().min(2, "Car name must be at least 2 characters"),
    brand: z.string().min(1, "Please select a brand"),
    category: z.string().min(1, "Please select a category"),
    year: z.coerce.number().min(2000, "Year must be 2000 or newer").max(new Date().getFullYear() + 1, "Invalid year"),
    fuelType: z.enum(["Petrol", "Diesel", "Electric", "Hybrid", "CNG"]),
    transmission: z.enum(["Manual", "Automatic"]),
    seats: z.coerce.number().min(2, "Minimum 2 seats").max(10, "Maximum 10 seats"),
    registrationNumber: z.string().min(3, "Invalid registration number"),
    pricePerDay: z.coerce.number().min(100, "Price must be at least ₹100 per day"),
    description: z.string().optional().or(z.literal("")),
    isFeatured: z.boolean(),
    // status: z.enum(["Available", "Booked", "Rented", "Maintenance"]),
    isActive: z.boolean(),
});
