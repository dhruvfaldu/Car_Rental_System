import { Booking } from "../booking.model.js";
import ApiError from "../../../utils/ApiError.js";
import Payment from "../../payment/payment.model.js";
import { PAYMENT_STATUS } from "../../payment/payment.constant.js";
import Car from "../../Cars/car.model.js";
import { CAR_STATUS } from "../../Cars/car.constant.js";

import {
    BOOKING_STATUS,
} from "../booking.constant.js";

import { checkAvailability } from "./checkAvailability.js";

export const confirmBooking = async ({
    bookingId,
    adminId,
    pickupDateTime,
    confirmationNote,
}) => {

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    if (booking.bookingStatus !== BOOKING_STATUS.PENDING) {
        throw new ApiError(
            400,
            "Only pending bookings can be confirmed."
        );
    }

    if (booking.paymentMethod !== "Cash") {
        if (!booking.payment) {
            throw new ApiError(
                400,
                "Payment not found for this booking."
            );
        }

        const payment = await Payment.findById(booking.payment);

        if (!payment) {
            throw new ApiError(404, "Payment not found.");
        }

        if (payment.status !== PAYMENT_STATUS.PAID) {
            throw new ApiError(
                400,
                "Only paid bookings can be confirmed."
            );
        }
    }

    await checkAvailability({
        carId: booking.car,
        pickupDate: booking.pickupDate,
        returnDate: booking.returnDate,
        excludeBookingId: booking._id, // we'll support this in checkAvailability()
    });

    booking.bookingStatus = BOOKING_STATUS.CONFIRMED;

    booking.confirmedBy = adminId;

    booking.confirmedAt = new Date();

    booking.pickupDateTime = pickupDateTime;

    booking.confirmationNote = confirmationNote || "";

    await booking.save();



    await booking.populate([
        {
            path: "user",
            select: "name email phone",
        },
        {
            path: "car",
            select: "name carId pricePerDay images",
        },
        {
            path: "confirmedBy",
            select: "name email",
        },
    ]);

    return booking;
};