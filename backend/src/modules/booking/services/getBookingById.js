import { Booking } from "../booking.model.js";
import ApiError from "../../../utils/ApiError.js";

export const getBookingById = async ({
    bookingId,
    userId,
    role,
}) => {
    const booking = await Booking.findById(bookingId)
        .populate({
            path: "user",
            select: "name email phone",
        })
        .populate({
            path: "payment",
            select:
                "status amount paymentMethod transactionId paidAt",
        })
        .populate({
            path: "car",
            populate: [
                {
                    path: "brand",
                    select: "name slug",
                },
                {
                    path: "category",
                    select: "name slug",
                },
                {
                    path: "features",
                    select: "name icon",
                },
            ],
        });

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    const isOwner =
        booking.user._id.toString() === userId.toString();

    const isAdmin = role === "admin";

    if (!isOwner && !isAdmin) {
        throw new ApiError(
            403,
            "You are not authorized to access this booking."
        );
    }

    return booking;
};