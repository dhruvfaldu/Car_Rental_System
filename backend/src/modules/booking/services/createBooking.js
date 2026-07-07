import { Booking } from "../booking.model.js";

import { generateBookingNumber } from "../booking.utils.js";

import { checkAvailability } from "./checkAvailability.js";

import { calculateBookingPrice } from "./calculateBookingPrice.js";

export const createBooking = async ({
    userId,
    bookingData,
}) => {

    const {
        car,
        pickupDate,
        returnDate,
        pickupLocation,
        dropLocation,
        paymentMethod,
        notes,
    } = bookingData;

    const carData = await checkAvailability({
        carId: car,
        pickupDate,
        returnDate
    });

    const bookingNumber = generateBookingNumber();

    const pricing = calculateBookingPrice({
        pickupDate,
        returnDate,
        pricePerDay: carData.pricePerDay,
        securityDeposit: carData.securityDeposit,
    });

    const booking = await Booking.create({
        bookingNumber,

        user: userId,

        car,

        pickupDate,
        returnDate,

        pickupLocation,
        dropLocation,

        paymentMethod,

        notes,

        ...pricing,
    });

    return await Booking.findById(booking._id)
        .populate("user", "name email")
        .populate("car", "name carId pricePerDay images");
};