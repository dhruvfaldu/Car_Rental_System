import mongoose from "mongoose";

import Payment from "../payment.model.js";

import ApiError from "../../../utils/ApiError.js";

import razorpay from "../../../config/razorpay.js";

import { PAYMENT_STATUS } from "../payment.constant.js";

export const refundPayment = async ({
    paymentId,
    refundAmount,
    refundReason = "",
}) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const payment = await Payment.findById(paymentId)
            .session(session);

        if (!payment) {
            throw new ApiError(
                404,
                "Payment not found."
            );
        }

        if (payment.status !== PAYMENT_STATUS.PAID) {
            throw new ApiError(
                400,
                "Only paid payments can be refunded."
            );
        }

        if (refundAmount > payment.amount) {
            throw new ApiError(
                400,
                "Refund amount exceeds payment amount."
            );
        }

        const refund = await razorpay.payments.refund(
            payment.transactionId,
            {
                amount: refundAmount * 100,
            }
        );

        payment.refundAmount = refundAmount;

        payment.refundReason = refundReason;

        payment.refundId = refund.id;

        payment.refundedAt = new Date();

        payment.refundResponse = refund;

        payment.status =
            refundAmount === payment.amount
                ? PAYMENT_STATUS.REFUNDED
                : PAYMENT_STATUS.PARTIALLY_REFUNDED;

        await payment.save({
            session,
        });

        await session.commitTransaction();

        return payment;

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        session.endSession();

    }
};