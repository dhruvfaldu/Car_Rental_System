import Payment from "../payment.model.js";
import { Booking } from "../../booking/booking.model.js";

import ApiError from "../../../utils/ApiError.js";

import {
    PAYMENT_STATUS,
    PAYMENT_STATUS_TRANSITIONS,
} from "../payment.constant.js";

import {
    PAYMENT_STATUS as BOOKING_PAYMENT_STATUS,
    BOOKING_STATUS,
} from "../../booking/booking.constant.js";

export const changePaymentStatus = async ({
    paymentId,
    status,
}) => {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
        throw new ApiError(404, "Payment not found.");
    }

    const currentStatus = payment.status;

    const allowedStatuses =
        PAYMENT_STATUS_TRANSITIONS[currentStatus];

    if (!allowedStatuses.includes(status)) {
        throw new ApiError(
            400,
            `Cannot change payment status from "${currentStatus}" to "${status}".`
        );
    }

    const booking = await Booking.findById(payment.booking);

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    payment.status = status;

    switch (status) {
        case PAYMENT_STATUS.PAID:

            payment.paidAt = new Date();

            booking.paymentStatus =
                BOOKING_PAYMENT_STATUS.PAID;

            booking.bookingStatus =
                BOOKING_STATUS.CONFIRMED;

            booking.paidAt = payment.paidAt;

            break;

        case PAYMENT_STATUS.PARTIALLY_REFUNDED:

            booking.paymentStatus =
                BOOKING_PAYMENT_STATUS.PARTIALLY_REFUNDED;

            booking.refundedAt = new Date();

            break;

        case PAYMENT_STATUS.REFUNDED:

            booking.paymentStatus =
                BOOKING_PAYMENT_STATUS.REFUNDED;

            booking.refundedAt = new Date();

            break;

        case PAYMENT_STATUS.FAILED:

            booking.paymentStatus =
                BOOKING_PAYMENT_STATUS.FAILED;

            break;
    }

    await payment.save();

    await booking.save();

    return await Payment.findById(payment._id)
        .populate("user", "name email")
        .populate({
            path: "booking",
            select:
                "bookingNumber bookingStatus paymentStatus totalAmount",
        });
};