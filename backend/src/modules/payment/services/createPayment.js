import mongoose from "mongoose";

import Payment from "../payment.model.js";
import { Booking } from "../../booking/booking.model.js";

import ApiError from "../../../utils/ApiError.js";

import {
    PAYMENT_GATEWAY,
    PAYMENT_STATUS,
} from "../payment.constant.js";

export const createPayment = async ({
    bookingId,
    userId,
    paymentMethod,
    paymentGateway = PAYMENT_GATEWAY.OFFLINE,
}) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        console.log("Received bookingId:", bookingId);

        // Find Booking
        const booking = await Booking.findById(bookingId).session(session);
        console.log("Booking =", booking);
        if (!booking) {
            throw new ApiError(404, "Booking not found.");
        }

        // Owner Check
        if (booking.user.toString() !== userId.toString()) {
            throw new ApiError(
                403,
                "You are not authorized to create payment for this booking."
            );
        }

        // Already Linked
        if (booking.payment) {
            const existingPayment = await Payment.findById(booking.payment).session(session);
            if (existingPayment && (existingPayment.status === PAYMENT_STATUS.PENDING || existingPayment.status === PAYMENT_STATUS.FAILED)) {
                await session.commitTransaction();
                return await Payment.findById(existingPayment._id)
                    .populate("user", "name email")
                    .populate({
                        path: "booking",
                        select:
                            "bookingNumber totalAmount bookingStatus",
                    });
            } else {
                throw new ApiError(
                    409,
                    "Payment already exists for this booking."
                );
            }
        }

        // Cancelled Booking
        if (booking.bookingStatus === "Cancelled") {
            throw new ApiError(
                400,
                "Cannot create payment for cancelled booking."
            );
        }


        // Create Payment
        const [payment] = await Payment.create(
            [
                {
                    booking: booking._id,

                    user: booking.user,

                    amount: booking.totalAmount,

                    paymentMethod,

                    paymentGateway,

                    status: PAYMENT_STATUS.PENDING,
                },
            ],
            { session }
        );

        // Link Booking
        booking.payment = payment._id;

        await booking.save({ session });

        await session.commitTransaction();

        return await Payment.findById(payment._id)
            .populate("user", "name email")
            .populate({
                path: "booking",
                select:
                    "bookingNumber totalAmount bookingStatus",
            });

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        session.endSession();

    }
};