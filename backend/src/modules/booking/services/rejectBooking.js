import { Booking } from "../booking.model.js";
import ApiError from "../../../utils/ApiError.js";

import {
    BOOKING_STATUS,
} from "../booking.constant.js";

export const rejectBooking = async ({
    bookingId,
    adminId,
    rejectionReason,
}) => {

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    if (booking.bookingStatus !== BOOKING_STATUS.PENDING) {
        throw new ApiError(
            400,
            "Only pending bookings can be rejected."
        );
    }

    booking.bookingStatus = BOOKING_STATUS.CANCELLED;

    booking.cancelReason = rejectionReason;

    booking.rejectionReason = rejectionReason;

    booking.cancelledAt = new Date();

    booking.cancelledBy = adminId;

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
    ]);

    return booking;
};