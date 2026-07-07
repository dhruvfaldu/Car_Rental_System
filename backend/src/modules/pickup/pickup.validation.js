import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const createPickupValidation = z.object({
    body: z.object({
        booking: objectId,
        odometerStart: z.coerce.number().int().min(0, "Odometer starting reading must be positive."),
        fuelLevel: z.coerce.number().int().min(0).max(100, "Fuel level must be between 0% and 100%."),
        notes: z.string().trim().optional(),
    }),
});
