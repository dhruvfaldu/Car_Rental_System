import mongoose from "mongoose";
import Pickup from "./pickup.model.js";
import { Booking } from "../booking/booking.model.js";
import Car from "../Cars/car.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { uploadMultipleImages } from "../../services/cloudinary.service.js";
import { CAR_STATUS } from "../Cars/car.constant.js";
import { BOOKING_STATUS } from "../booking/booking.constant.js";
import notificationService from "../../services/notification.service.js";
import User from "../../models/user.model.js";

export const createPickup = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { booking: bookingId, odometerStart, fuelLevel, notes } = req.body;

        // 1. Fetch booking
        const booking = await Booking.findById(bookingId).session(session);
        if (!booking) {
            throw new ApiError(404, "Booking not found.");
        }

        // 2. Validate booking status
        if (booking.bookingStatus !== BOOKING_STATUS.CONFIRMED) {
            throw new ApiError(400, `Cannot process pickup for booking with status "${booking.bookingStatus}". Only Confirmed bookings can be picked up.`);
        }

        // 3. Prevent duplicate pickup
        const existingPickup = await Pickup.findOne({ booking: bookingId }).session(session);
        if (existingPickup) {
            throw new ApiError(409, "Pickup details already recorded for this booking.");
        }

        // 4. Upload vehicle condition images
        let uploadedImages = [];
        if (req.files && req.files.length > 0) {
            uploadedImages = await uploadMultipleImages(req.files, "car-rental/pickups");
        }

        // 5. Create Pickup record
        const [pickup] = await Pickup.create(
            [
                {
                    booking: bookingId,
                    car: booking.car,
                    customer: booking.user,
                    pickupDate: new Date(),
                    pickupLocation: booking.pickupLocation,
                    odometerStart,
                    fuelLevel,
                    images: uploadedImages,
                    notes,
                    staff: req.user._id,
                    // If signature is uploaded (could be passed in req.files or mock signature)
                    signature: {
                        public_id: "mock_sig_id",
                        secure_url: "https://res.cloudinary.com/mock-signature.png"
                    }
                }
            ],
            { session }
        );

        // 6. Update Booking status & link pickup
        booking.bookingStatus = BOOKING_STATUS.PICKED_UP || "Picked Up";
        booking.pickedUpAt = new Date();
        booking.pickupDetails = pickup._id;
        await booking.save({ session });

        // 7. Update Car status
        await Car.findByIdAndUpdate(
            booking.car,
            { status: CAR_STATUS.RENTED },
            { session, new: true }
        );

        await session.commitTransaction();

        // 8. Send Notification
        const user = await User.findById(booking.user);
        if (user) {
            await notificationService.sendPickupReminder(user, booking);
        }

        const populatedPickup = await Pickup.findById(pickup._id)
            .populate("customer", "name email phone")
            .populate("car", "name carId")
            .populate("staff", "name email");

        return res.status(201).json(
            new ApiResponse(201, "Pickup recorded successfully.", populatedPickup)
        );
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

export const getPickupById = asyncHandler(async (req, res) => {
    const pickup = await Pickup.findById(req.params.id)
        .populate("customer", "name email phone")
        .populate("car", "name carId pricePerDay allowedKMPerDay pricePerKM")
        .populate("staff", "name email")
        .populate("booking", "bookingNumber pickupDate returnDate");

    if (!pickup) {
        throw new ApiError(404, "Pickup record not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, "Pickup fetched successfully.", pickup)
    );
});

export const getPickupByBookingId = asyncHandler(async (req, res) => {
    const pickup = await Pickup.findOne({ booking: req.params.bookingId })
        .populate("customer", "name email phone")
        .populate("car", "name carId pricePerDay allowedKMPerDay pricePerKM")
        .populate("staff", "name email");

    if (!pickup) {
        throw new ApiError(404, "Pickup record not found for this booking.");
    }

    return res.status(200).json(
        new ApiResponse(200, "Pickup fetched successfully.", pickup)
    );
});
