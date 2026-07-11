import { Booking } from "../booking.model.js";
import ApiError from "../../../utils/ApiError.js";
import { BOOKING_STATUS } from "../booking.constant.js";
import Car from "../../Cars/car.model.js";
import { CAR_STATUS } from "../../Cars/car.constant.js";

export const cancelBooking = async ({
    bookingId,
    userId,
    role,
    cancelReason,
}) => {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    // Check if the user is authorized to cancel this booking
    const isOwner = booking.user.toString() === userId.toString();
    const isAdmin = role === "admin";

    if (!isOwner && !isAdmin) {
        throw new ApiError(403, "You are not authorized to cancel this booking.");
    }

    // Check if booking is cancelable
    const allowedStatuses = [
        BOOKING_STATUS.PENDING,
        BOOKING_STATUS.CONFIRMED,
    ];

    if (!allowedStatuses.includes(booking.bookingStatus)) {
        throw new ApiError(
            400,
            `Cannot cancel booking in "${booking.bookingStatus}" status.`
        );
    }

    const wasConfirmed = booking.bookingStatus === BOOKING_STATUS.CONFIRMED;

    booking.bookingStatus = BOOKING_STATUS.CANCELLED;
    booking.cancelReason = cancelReason;
    booking.cancelledAt = new Date();
    booking.cancelledBy = userId;

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