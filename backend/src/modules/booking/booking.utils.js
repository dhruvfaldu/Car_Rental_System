/**
 * Calculate total booking days
 */
export const calculateTotalDays = (pickupDate, returnDate) => {
    const pickup = new Date(pickupDate);
    const drop = new Date(returnDate);

    const difference = drop.getTime() - pickup.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

/**
 * Calculate subtotal
 */
export const calculateSubtotal = (pricePerDay, totalDays) => {
    return pricePerDay * totalDays;
};

/**
 * Calculate tax
 */
export const calculateTax = (subtotal, taxPercentage = 18) => {
    return (subtotal * taxPercentage) / 100;
};

/**
 * Calculate grand total
 */
export const calculateGrandTotal = ({
    subtotal,
    discount = 0,
    tax = 0,
    securityDeposit = 0,
}) => {
    return subtotal - discount + tax + securityDeposit;
};

/**
 * Generate booking number
 *
 * Example:
 * CR-20260702-483921
 */
export const generateBookingNumber = () => {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    const random = Math.floor(100000 + Math.random() * 900000);

    return `CR-${year}${month}${day}-${random}`;
};

/**
 * Check date overlap
 */
export const isDateOverlap = (requestedPickup, requestedReturn, existingPickup, existingReturn) => {
    return (requestedPickup < existingReturn && requestedReturn > existingPickup);
};