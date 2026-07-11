import { Booking } from "../booking.model.js";
import ApiError from "../../../utils/ApiError.js";
import {
    BOOKING_STATUS,
    BOOKING_STATUS_TRANSITIONS,
} from "../booking.constant.js";
import Car from "../../Cars/car.model.js";
import { CAR_STATUS } from "../../Cars/car.constant.js";

export const updateBookingStatus = async ({
    bookingId,
    bookingStatus,
}) => {

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    const currentStatus = booking.bookingStatus;

    const allowedStatuses =
        BOOKING_STATUS_TRANSITIONS[currentStatus];

    if (!allowedStatuses.includes(bookingStatus)) {
        throw new ApiError(
            400,
            `Cannot change booking status from "${currentStatus}" to "${bookingStatus}".`
        );
    }

    const wasConfirmed = currentStatus === BOOKING_STATUS.CONFIRMED;

    booking.bookingStatus = bookingStatus;

    // Track timestamps
    if (bookingStatus === BOOKING_STATUS.CONFIRMED) {
        booking.confirmedAt = new Date();
    }

    if (bookingStatus === BOOKING_STATUS.PICKED_UP) {
        booking.pickedUpAt = new Date();
    }

    if (bookingStatus === BOOKING_STATUS.COMPLETED) {
        booking.completedAt = new Date();
    }

    await booking.save();



    await booking.populate([
        {
            path: "user",
            select: "name email phone",
        },
        {
            path: "car",
            select: "name carId",
        },
    ]);

    return booking;
};