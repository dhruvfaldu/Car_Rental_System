import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true,
        },

        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
            default: null,
        },

        pickup: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pickup",
            default: null,
        },

        return: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Return",
            default: null,
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },

        extraCharges: {
            lateFee: {
                type: Number,
                default: 0,
            },
            extraKMFee: {
                type: Number,
                default: 0,
            },
            fuelCharges: {
                type: Number,
                default: 0,
            },
            cleaningCharges: {
                type: Number,
                default: 0,
            },
            damageCharges: {
                type: Number,
                default: 0,
            },
        },

        tax: {
            type: Number,
            required: true,
            default: 0,
        },

        discount: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalPaid: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        remainingAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: String,
            enum: ["Paid", "Pending", "Refunded"],
            default: "Pending",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
