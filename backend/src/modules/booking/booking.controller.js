import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import { createBooking } from "./services/createBooking.js";
import { getBookingById } from "./services/getBookingById.js";
import { getMyBookings } from "./services/getMyBookings.js";
import { getAllBookings } from "./services/getAllBookings.js";
import { cancelBooking } from "./services/cancelBooking.js";
import { updateBookingStatus } from "./services/updateBookingStatus.js";
// import { updatePaymentStatus } from "./services/updatePaymentStatus.js";
import { deleteBooking } from "./services/deleteBooking.js";
import { getPendingBookings } from "./services/getPendingBookings.js";
import { confirmBooking } from "./services/confirmBooking.js";
import { rejectBooking } from "./services/rejectBooking.js";

export const createBookingController = asyncHandler(
    async (req, res) => {
        const booking = await createBooking({
            userId: req.user._id,
            bookingData: req.body,
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                "Booking created successfully.",
                booking
            )
        );
    }
);

export const getBookingByIdController =
    asyncHandler(async (req, res) => {
        const booking = await getBookingById({
            bookingId: req.params.bookingId,
            userId: req.user._id,
            role: req.user.role,
        });

        return res.json(
            new ApiResponse(
                200,
                "Booking fetched successfully.",
                booking
            )
        );
    });

export const getMyBookingsController =
    asyncHandler(async (req, res) => {
        const result = await getMyBookings({
            userId: req.user._id,
            ...req.query,
        });

        return res.json(
            new ApiResponse(
                200,
                "Bookings fetched successfully.",
                result.bookings,
                {
                    pagination: result.pagination,
                }
            )
        );
    });

export const getAllBookingsController =
    asyncHandler(async (req, res) => {
        const result = await getAllBookings({
            queryParams: req.query,
        });

        return res.json(
            new ApiResponse(
                200,
                "All bookings fetched successfully.",
                result.bookings,
                {
                    pagination: result.pagination,
                }
            )
        );
    });

export const cancelBookingController =
    asyncHandler(async (req, res) => {
        const booking = await cancelBooking({
            bookingId: req.params.bookingId,
            userId: req.user._id,
            role: req.user.role,
            cancelReason: req.body.cancelReason,
        });

        return res.json(
            new ApiResponse(
                200,
                "Booking cancelled successfully.",
                booking
            )
        );
    });

export const updateBookingStatusController =
    asyncHandler(async (req, res) => {
        const booking =
            await updateBookingStatus({
                bookingId: req.params.bookingId,
                bookingStatus:
                    req.body.bookingStatus,
            });

        return res.json(
            new ApiResponse(
                200,
                "Booking status updated successfully.",
                booking
            )
        );
    });

// export const updatePaymentStatusController =
//     asyncHandler(async (req, res) => {
//         const booking =
//             await updatePaymentStatus({
//                 bookingId: req.params.bookingId,
//                 paymentStatus:
//                     req.body.paymentStatus,
//             });

//         return res.json(
//             new ApiResponse(
//                 200,
//                 "Payment status updated successfully.",
//                 booking
//             )
//         );
//     });

export const deleteBookingController =
    asyncHandler(async (req, res) => {
        const result = await deleteBooking({
            bookingId: req.params.bookingId,
        });

        return res.json(
            new ApiResponse(
                200,
                result.message
            )
        );
    });

export const getPendingBookingsController =
    asyncHandler(async (req, res) => {
        const bookings =
            await getPendingBookings();

        return res.json(
            new ApiResponse(
                200,
                "Pending bookings fetched successfully.",
                bookings
            )
        );
    });

export const confirmBookingController =
    asyncHandler(async (req, res) => {
        const booking =
            await confirmBooking({
                bookingId: req.params.bookingId,
                adminId: req.user._id,
                pickupDateTime:
                    req.body.pickupDateTime,
                confirmationNote:
                    req.body.confirmationNote,
            });

        return res.json(
            new ApiResponse(
                200,
                "Booking confirmed successfully.",
                booking
            )
        );
    });

export const rejectBookingController =
    asyncHandler(async (req, res) => {
        const booking =
            await rejectBooking({
                bookingId: req.params.bookingId,
                adminId: req.user._id,
                rejectionReason:
                    req.body.rejectionReason,
            });

        return res.json(
            new ApiResponse(
                200,
                "Booking rejected successfully.",
                booking
            )
        );
    });