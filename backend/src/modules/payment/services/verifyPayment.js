import mongoose from "mongoose";

import Payment from "../payment.model.js";
import { Booking } from "../../booking/booking.model.js";
import Car from "../../Cars/car.model.js";
import { CAR_STATUS } from "../../Cars/car.constant.js";

import ApiError from "../../../utils/ApiError.js";

import { verifySignature } from "../utils/verifySignature.js";

import { PAYMENT_STATUS } from "../payment.constant.js";

import { BOOKING_STATUS } from "../../booking/booking.constant.js";

export const verifyPayment = async ({
    paymentId,
    orderId,
    razorpayPaymentId,
    razorpaySignature,
    gatewayResponse = {},
}) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const payment = await Payment.findById(paymentId).session(session);

        if (!payment) {
            throw new ApiError(404, "Payment not found.");
        }

        if (payment.status !== PAYMENT_STATUS.PENDING) {
            throw new ApiError(
                400,
                "Payment has already been processed."
            );
        }

        if (payment.orderId !== orderId) {
            throw new ApiError(
                400,
                "Invalid Razorpay order."
            );
        }

        verifySignature({
            orderId,
            paymentId: razorpayPaymentId,
            signature: razorpaySignature,
        });

        payment.status = PAYMENT_STATUS.PAID;

        payment.transactionId = razorpayPaymentId;

        payment.paidAt = new Date();

        payment.gatewayResponse = gatewayResponse;

        await payment.save({ session });

        const booking = await Booking.findById(payment.booking)
            .session(session);

        if (!booking) {
            throw new ApiError(
                404,
                "Booking not found."
            );
        }

        booking.bookingStatus = BOOKING_STATUS.CONFIRMED;

        booking.paidAt = payment.paidAt;

        await booking.save({ session });



        await session.commitTransaction();

        return await Payment.findById(payment._id)
            .populate("user", "name email")
            .populate({
                path: "booking",
                populate: {
                    path: "car",
                    select: "name carId images",
                },
            });

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        session.endSession();

    }
};