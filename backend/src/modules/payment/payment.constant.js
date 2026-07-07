export const PAYMENT_STATUS = {
    PENDING: "Pending",
    PAID: "Paid",
    FAILED: "Failed",
    REFUNDED: "Refunded",
    PARTIALLY_REFUNDED: "Partially Refunded",
};

export const PAYMENT_STATUS_VALUES = Object.values(PAYMENT_STATUS);

export const PAYMENT_METHOD = {
    CASH: "Cash",
    CARD: "Card",
    UPI: "UPI",
    NET_BANKING: "Net Banking",
    WALLET: "Wallet",
    ONLINE: "Online",
};

export const PAYMENT_METHOD_VALUES = Object.values(PAYMENT_METHOD);

export const PAYMENT_GATEWAY = {
    OFFLINE: "Offline",
    RAZORPAY: "Razorpay",
    STRIPE: "Stripe",
};

export const PAYMENT_GATEWAY_VALUES = Object.values(PAYMENT_GATEWAY);

export const REFUND_STATUS = {
    NONE: "None",
    REQUESTED: "Requested",
    PROCESSED: "Processed",
};

export const PAYMENT_STATUS_TRANSITIONS = {
    Pending: [
        "Paid",
        "Failed",
    ],

    Failed: [
        "Pending",
    ],

    Paid: [
        "Partially Refunded",
        "Refunded",
    ],

    "Partially Refunded": [
        "Refunded",
    ],

    Refunded: [],
};

export const REFUND_STATUS_VALUES = Object.values(REFUND_STATUS);