/**
 * Calculate extra charges on car return
 * 
 * @param {Object} params
 * @param {Object} params.booking - Booking document/object
 * @param {Object} params.car - Car document/object
 * @param {Date} params.actualReturnDate - Actual return date/time
 * @param {number} params.odometerEnd - Odometer reading at return
 * @param {number} params.odometerStart - Odometer reading at pickup
 * @param {number} params.fuelEnd - Fuel percentage at return
 * @param {number} params.fuelStart - Fuel percentage at pickup
 * @param {number} [params.cleaningCharges=0] - Cleaning fee if dirty
 * @param {number} [params.damageCharges=0] - Damage fee if damaged
 * @param {number} [params.taxPercentage=18] - Tax rate
 * @returns {Object} calculated charges breakdown
 */
export const calculateExtraCharges = ({
    booking,
    car,
    actualReturnDate,
    odometerEnd,
    odometerStart,
    fuelEnd,
    fuelStart,
    cleaningCharges = 0,
    damageCharges = 0,
    taxPercentage = 18,
}) => {
    // 1. Calculate Late Hours
    const scheduledReturn = new Date(booking.returnDate);
    const actualReturn = new Date(actualReturnDate);
    let lateHours = 0;

    if (actualReturn > scheduledReturn) {
        const diffMs = actualReturn.getTime() - scheduledReturn.getTime();
        lateHours = Math.ceil(diffMs / (1000 * 60 * 60)); // rounded up to nearest hour
    }

    const lateFeeRate = car.lateFeePerHour || 150;
    const lateFee = lateHours * lateFeeRate;

    // 2. Calculate Extra Kilometers
    const totalKM = Math.max(0, odometerEnd - odometerStart);
    const allowedKMPerDay = car.allowedKMPerDay || 200;
    const allowedKM = booking.totalDays * allowedKMPerDay;
    const extraKM = Math.max(0, totalKM - allowedKM);

    const pricePerKM = car.pricePerKM || 15;
    const extraKMFee = extraKM * pricePerKM;

    // 3. Calculate Fuel Charges
    let fuelCharges = 0;
    if (fuelEnd < fuelStart) {
        const fuelDrop = fuelStart - fuelEnd; // difference in percentage
        const fuelChargeRate = car.fuelChargePercentage || 50; // ₹50 per % drop
        fuelCharges = fuelDrop * fuelChargeRate;
    }

    // 4. Summarize charges
    const extraChargesSubtotal = lateFee + extraKMFee + fuelCharges + Number(cleaningCharges) + Number(damageCharges);
    const tax = (extraChargesSubtotal * taxPercentage) / 100;
    const totalExtraAmount = extraChargesSubtotal + tax;

    return {
        lateHours,
        lateFee,
        totalKM,
        allowedKM,
        extraKM,
        extraKMFee,
        fuelDrop: Math.max(0, fuelStart - fuelEnd),
        fuelCharges,
        cleaningCharges,
        damageCharges,
        taxPercentage,
        tax,
        subtotal: extraChargesSubtotal,
        totalExtraAmount,
    };
};
