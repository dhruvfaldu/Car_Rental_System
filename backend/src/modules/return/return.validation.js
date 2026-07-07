import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const createReturnValidation = z.object({
    body: z.object({
        booking: objectId,
        odometerEnd: z.coerce.number().int().min(0, "Odometer ending reading must be positive."),
        fuelLevel: z.coerce.number().int().min(0).max(100, "Fuel level must be between 0% and 100%."),
        damageNotes: z.string().trim().optional(),
        cleaningCharges: z.coerce.number().min(0).optional().default(0),
        damageCharges: z.coerce.number().min(0).optional().default(0),
    }),
});
