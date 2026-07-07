import { z } from "zod";

import {
    BOOKING_STATUS,
    BOOKING_STATUS_VALUES,
    PAYMENT_STATUS_VALUES,
    PAYMENT_METHOD_VALUES,
} from "./booking.constant.js";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const createBookingValidation = z.object({
    body: z
        .object({
            car: objectId,

            pickupDate: z.coerce.date({
                required_error: "Pickup date is required",
            }),

            returnDate: z.coerce.date({
                required_error: "Return date is required",
            }),

            pickupLocation: z
                .string()
                .trim()
                .min(3, "Pickup location must be at least 3 characters"),

            dropLocation: z
                .string()
                .trim()
                .min(3, "Drop location must be at least 3 characters"),

            paymentMethod: z
                .enum(PAYMENT_METHOD_VALUES)
                .optional(),

            notes: z
                .string()
                .trim()
                .max(500)
                .optional(),
        })
        .superRefine((data, ctx) => {
            const today = new Date();

            today.setHours(0, 0, 0, 0);

            if (data.pickupDate < today) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["pickupDate"],
                    message: "Pickup date cannot be in the past",
                });
            }

            if (data.returnDate <= data.pickupDate) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["returnDate"],
                    message: "Return date must be after pickup date",
                });
            }
        }),
});

export const cancelBookingValidation = z.object({
    body: z.object({
        cancelReason: z
            .string()
            .trim()
            .min(5, "Cancellation reason is required")
            .max(500),
    }),
});



export const updateBookingStatusValidation = z.object({
    body: z.object({
        bookingStatus: z.enum([
            BOOKING_STATUS.PICKED_UP,
            BOOKING_STATUS.COMPLETED,
        ]),
    }),
});

export const confirmBookingValidation = z.object({
    body: z.object({
        pickupDateTime: z.coerce.date({
            required_error: "Pickup date & time is required",
        }),

        confirmationNote: z
            .string()
            .trim()
            .max(500, "Confirmation note cannot exceed 500 characters")
            .optional(),
    }),
});

export const rejectBookingValidation = z.object({
    body: z.object({
        rejectionReason: z
            .string()
            .trim()
            .min(5, "Rejection reason is required")
            .max(500, "Rejection reason cannot exceed 500 characters"),
    }),
});

// export const updatePaymentStatusValidation = z.object({
//     body: z.object({
//         paymentStatus: z.enum(PAYMENT_STATUS_VALUES),
//     }),
// });
