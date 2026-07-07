import { Booking } from "../booking.model.js";
import ApiError from "../../../utils/ApiError.js";
import { BOOKING_STATUS } from "../booking.constant.js";

export const deleteBooking = async ({
    bookingId,
}) => {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    const allowedStatuses = [
        BOOKING_STATUS.CANCELLED,
        BOOKING_STATUS.COMPLETED,
    ];

    if (!allowedStatuses.includes(booking.bookingStatus)) {
        throw new ApiError(
            400,
            "Only cancelled or completed bookings can be deleted."
        );
    }

    await booking.deleteOne();

    return {
        success: true,
        message: "Booking deleted successfully.",
    };
};