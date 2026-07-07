// src/modules/booking/services/calculateBookingPrice.js

import {
    calculateGrandTotal,
    calculateSubtotal,
    calculateTax,
    calculateTotalDays,
} from "../booking.utils.js";

export const calculateBookingPrice = ({
    pickupDate,
    returnDate,
    pricePerDay,
    securityDeposit = 0,
    discount = 0,
    taxPercentage = 18,
}) => {
    // Calculate booking duration
    const totalDays = calculateTotalDays(
        pickupDate,
        returnDate
    );

    // Calculate subtotal
    const subtotal = calculateSubtotal(
        pricePerDay,
        totalDays
    );

    // Calculate tax
    const tax = calculateTax(
        subtotal,
        taxPercentage
    );

    // Calculate grand total
    const totalAmount = calculateGrandTotal({
        subtotal,
        discount,
        tax,
        securityDeposit,
    });

    return {
        totalDays,
        pricePerDay,
        subtotal,
        discount,
        tax,
        securityDeposit,
        totalAmount,
    };
};