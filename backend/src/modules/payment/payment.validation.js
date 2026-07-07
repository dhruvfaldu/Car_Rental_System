import { z } from "zod";

import {
    PAYMENT_GATEWAY_VALUES,
    PAYMENT_METHOD_VALUES,
    PAYMENT_STATUS_VALUES,
    REFUND_STATUS_VALUES,
} from "./payment.constant.js";

const createPayment = z.object({
    body: z.object({
        bookingId: z
            .string({
                required_error: "Booking ID is required.",
            })
            .trim(),

        paymentMethod: z.enum(PAYMENT_METHOD_VALUES, {
            required_error: "Payment method is required.",
        }),

        paymentGateway: z
            .enum(PAYMENT_GATEWAY_VALUES)
            .optional(),
    }),
});

const verifyPayment = z.object({
    body: z.object({
        orderId: z
            .string({
                required_error: "Order ID is required.",
            })
            .trim(),

        paymentId: z
            .string({
                required_error: "Payment ID is required.",
            })
            .trim(),

        signature: z
            .string({
                required_error: "Signature is required.",
            })
            .trim(),
    }),
});

const refundPayment = z.object({
    body: z.object({
        refundAmount: z
            .number({
                required_error: "Refund amount is required.",
            })
            .positive(),

        refundReason: z
            .string({
                required_error: "Refund reason is required.",
            })
            .trim()
            .min(5, "Refund reason must be at least 5 characters."),
    }),
});

const updatePaymentStatus = z.object({
    body: z.object({
        status: z.enum(PAYMENT_STATUS_VALUES, {
            required_error: "Payment status is required.",
        }),

        refundStatus: z
            .enum(REFUND_STATUS_VALUES)
            .optional(),
    }),
});

export const createPaymentValidation = createPayment;
export const verifyPaymentValidation = verifyPayment;
export const refundPaymentValidation = refundPayment;
export const updatePaymentStatusValidation = updatePaymentStatus;

export const paymentValidation = {
    createPayment,
    verifyPayment,
    refundPayment,
    updatePaymentStatus,
};