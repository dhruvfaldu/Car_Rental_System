import { Booking } from "../booking.model.js";
import { BOOKING_STATUS } from "../booking.constant.js";

export const getPendingBookings = async () => {
    return await Booking.find({
        bookingStatus: BOOKING_STATUS.PENDING,
    })
        .populate({
            path: "user",
            select: "name email phone",
        })
        .populate({
            path: "car",
            select: "name carId pricePerDay images",
        })
        .sort({ createdAt: -1 });
};