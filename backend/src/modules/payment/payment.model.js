import mongoose from "mongoose";

import {
    PAYMENT_GATEWAY,
    PAYMENT_GATEWAY_VALUES,
    PAYMENT_METHOD,
    PAYMENT_METHOD_VALUES,
    PAYMENT_STATUS,
    PAYMENT_STATUS_VALUES,
    REFUND_STATUS,
    REFUND_STATUS_VALUES,
} from "./payment.constant.js";

const paymentSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        orderId: {
            type: String,
            trim: true,
            default: "",
        },

        receipt: {
            type: String,
            trim: true,
            default: "",
        },

        transactionId: {
            type: String,
            trim: true,
            default: "",
        },

        paymentGateway: {
            type: String,
            enum: PAYMENT_GATEWAY_VALUES,
            default: PAYMENT_GATEWAY.OFFLINE,
        },

        paymentMethod: {
            type: String,
            enum: PAYMENT_METHOD_VALUES,
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: "INR",
            uppercase: true,
            trim: true,
        },

        status: {
            type: String,
            enum: PAYMENT_STATUS_VALUES,
            default: PAYMENT_STATUS.PENDING,
        },

        paidAt: {
            type: Date,
            default: null,
        },

        refundedAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        refundStatus: {
            type: String,
            enum: REFUND_STATUS_VALUES,
            default: REFUND_STATUS.NONE,
        },

        refundReason: {
            type: String,
            trim: true,
            default: null,
        },

        refundId: {
            type: String,
            trim: true,
            default: "",
        },

        gatewayResponse: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },

        refundResponse: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;