import Payment from "../payment.model.js";

import ApiError from "../../../utils/ApiError.js";

import razorpay from "../../../config/razorpay.js";

import { PAYMENT_STATUS } from "../payment.constant.js";

export const createOrder = async ({
    paymentId,
}) => {

    const payment = await Payment.findById(paymentId);

    if (!payment) {
        throw new ApiError(
            404,
            "Payment not found."
        );
    }

    if (payment.status !== PAYMENT_STATUS.PENDING) {
        throw new ApiError(
            400,
            "Order can only be created for pending payments."
        );
    }

    // Prevent duplicate order creation
    if (payment.orderId) {
        return {
            orderId: payment.orderId,
            amount: payment.amount,
            currency: payment.currency,
            receipt: payment.receipt,
        };
    }

    const receipt = `receipt_${payment._id}`;

    const order = await razorpay.orders.create({
        amount: payment.amount * 100, // paise
        currency: payment.currency,
        receipt,
    });

    payment.orderId = order.id;
    payment.receipt = receipt;

    await payment.save();

    return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt,
    };
};