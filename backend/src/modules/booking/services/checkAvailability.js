// src/modules/booking/services/checkAvailability.js

import { Booking } from "../booking.model.js";
import Car from "../../Cars/car.model.js";
import { BOOKING_STATUS } from "../booking.constant.js";
import ApiError from "../../../utils/ApiError.js";
import { CAR_STATUS } from "../../Cars/car.constant.js";

// const session = await mongoose.startSession();

// session.startTransaction();

export const checkAvailability = async ({
    carId,
    pickupDate,
    returnDate,
    excludeBookingId = null,
    session,
}) => {

    /**
 * Checks whether a car is available for booking
 *
 * @param {Object} params
 * @param {string} params.carId
 * @param {Date} params.pickupDate
 * @param {Date} params.returnDate
 * @param {mongoose.ClientSession} [params.session]
 * @returns {Promise<Object>}
 */
    const query = Car.findById(carId)
        .select("pricePerDay securityDeposit status isActive")
        .lean();

    if (session) {
        query.session(session);
    }

    const car = await query;

    if (!car) {
        throw new ApiError(404, "Car not found.");
    }

    if (!car.isActive) {
        throw new ApiError(400, "Car is inactive.");
    }

    if (car.status !== CAR_STATUS.AVAILABLE) {
        throw new ApiError(
            400,
            "Car is not available for booking."
        );
    }

    const queryConditions = {
        car: carId,

        bookingStatus: {
            $in: [
                BOOKING_STATUS.CONFIRMED,
                BOOKING_STATUS.PICKED_UP,
            ],
        },

        pickupDate: {
            $lt: returnDate,
        },

        returnDate: {
            $gt: pickupDate,
        },
    };

    if (excludeBookingId) {
        queryConditions._id = { $ne: excludeBookingId };
    }

    const bookingQuery = Booking.findOne(queryConditions).lean();

    if (session) {
        bookingQuery.session(session);
    }

    const overlappingBooking = await bookingQuery;

    if (overlappingBooking) {
        throw new ApiError(
            409,
            "Car is already booked for the selected dates."
        );
    }

    return car;
};