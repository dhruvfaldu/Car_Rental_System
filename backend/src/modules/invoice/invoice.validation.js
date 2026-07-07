import { z } from "zod";

export const payInvoiceValidation = z.object({
    body: z.object({
        amountPaid: z.coerce.number().positive("Amount paid must be greater than 0."),
    }),
});
