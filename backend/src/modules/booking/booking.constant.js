// Booking Status
export const BOOKING_STATUS = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PICKED_UP: "Picked Up",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

// Payment Status
export const PAYMENT_STATUS = {
    PENDING: "Pending",
    PAID: "Paid",
    REFUNDED: "Refunded",
};

// Payment Methods
export const PAYMENT_METHOD = {
    CASH: "Cash",
    CARD: "Card",
    ONLINE: "Online",
};

export const BOOKING_STATUS_TRANSITIONS = {
    [BOOKING_STATUS.PENDING]: [
        BOOKING_STATUS.CONFIRMED,
        BOOKING_STATUS.CANCELLED,
    ],

    [BOOKING_STATUS.CONFIRMED]: [
        BOOKING_STATUS.PICKED_UP,
        BOOKING_STATUS.CANCELLED,
    ],

    [BOOKING_STATUS.PICKED_UP]: [
        BOOKING_STATUS.COMPLETED,
    ],

    [BOOKING_STATUS.COMPLETED]: [],

    [BOOKING_STATUS.CANCELLED]: [],
};

export const PAYMENT_STATUS_TRANSITIONS = {
    [PAYMENT_STATUS.PENDING]: [
        PAYMENT_STATUS.PAID,
    ],

    [PAYMENT_STATUS.PAID]: [
        PAYMENT_STATUS.REFUNDED,
    ],

    [PAYMENT_STATUS.REFUNDED]: [],
};

// Booking Status Array
export const BOOKING_STATUS_VALUES = Object.values(BOOKING_STATUS);

// Payment Status Array
export const PAYMENT_STATUS_VALUES = Object.values(PAYMENT_STATUS);

// Payment Method Array
export const PAYMENT_METHOD_VALUES = Object.values(PAYMENT_METHOD);