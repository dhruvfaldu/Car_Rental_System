import { Booking } from "../booking.model.js";
import { generateBookingNumber } from "../booking.utils.js";
import { checkAvailability } from "./checkAvailability.js";
import { calculateBookingPrice } from "./calculateBookingPrice.js";
import Payment from "../../payment/payment.model.js";
import { PAYMENT_STATUS, PAYMENT_GATEWAY } from "../../payment/payment.constant.js";

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

    if (paymentMethod === "Cash") {
        const payment = await Payment.create({
            booking: booking._id,
            user: userId,
            amount: booking.totalAmount,
            paymentMethod: "Cash",
            paymentGateway: PAYMENT_GATEWAY.OFFLINE,
            status: PAYMENT_STATUS.PENDING,
        });
        
        booking.payment = payment._id;
        await booking.save();
    }

    return await Booking.findById(booking._id)
        .populate("user", "name email")
        .populate("car", "name carId pricePerDay images")
        .populate("payment");
};