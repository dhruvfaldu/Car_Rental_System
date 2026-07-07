import mongoose from "mongoose";

import {
    BOOKING_STATUS,
    BOOKING_STATUS_VALUES,
    PAYMENT_METHOD,
    PAYMENT_METHOD_VALUES,
    PAYMENT_STATUS,
    PAYMENT_STATUS_VALUES,
} from "./booking.constant.js";

const bookingSchema = new mongoose.Schema(
    {
        bookingNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
            required: true,
            index: true,
        },

        pickupDate: {
            type: Date,
            required: true,
        },

        returnDate: {
            type: Date,
            required: true,
        },

        pickupLocation: {
            type: String,
            required: true,
            trim: true,
        },

        dropLocation: {
            type: String,
            required: true,
            trim: true,
        },

        totalDays: {
            type: Number,
            required: true,
            min: 1,
        },

        pricePerDay: {
            type: Number,
            required: true,
            min: 0,
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },

        discount: {
            type: Number,
            default: 0,
            min: 0,
        },

        tax: {
            type: Number,
            default: 0,
            min: 0,
        },

        securityDeposit: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentMethod: {
            type: String,
            enum: PAYMENT_METHOD_VALUES,
            default: PAYMENT_METHOD.ONLINE,
        },

        /*paymentStatus: {
            type: String,
            enum: PAYMENT_STATUS_VALUES,
            default: PAYMENT_STATUS.PENDING,
        },*/

        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
            default: null,
        },

        transactionId: {
            type: String,
            default: "",
        },

        orderId: {
            type: String,
            default: "",
        },

        bookingStatus: {
            type: String,
            enum: BOOKING_STATUS_VALUES,
            default: BOOKING_STATUS.PENDING,
        },

        notes: {
            type: String,
            trim: true,
            default: "",
        },

        cancelReason: {
            type: String,
            trim: true,
            default: "",
        },
        cancelledAt: Date,

        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        pickedUpAt: {
            type: Date,
            default: null,
        },

        completedAt: {
            type: Date,
            default: null,
        },

        paidAt: {
            type: Date,
            default: null,
        },

        refundedAt: {
            type: Date,
            default: null,
        },

        confirmedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        confirmedAt: {
            type: Date,
            default: null,
        },

        confirmationNote: {
            type: String,
            trim: true,
            default: "",
        },

        pickupDateTime: {
            type: Date,
            default: null,
        },

        rejectionReason: {
            type: String,
            trim: true,
            default: "",
        },

        assignedStaff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        driverName: {
            type: String,
            default: "",
        },

        driverPhone: {
            type: String,
            default: "",
        },

        pickupDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pickup",
            default: null,
        },

        returnDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Return",
            default: null,
        },

        invoice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Booking = mongoose.model("Booking", bookingSchema);