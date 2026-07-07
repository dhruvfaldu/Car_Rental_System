import Payment from "../payment.model.js";

import ApiError from "../../../utils/ApiError.js";

export const getPaymentById = async ({
    paymentId,
    userId,
    role,
}) => {
    const payment = await Payment.findById(paymentId)
        .populate({
            path: "user",
            select: "name email phone",
        })
        .populate({
            path: "booking",
            populate: {
                path: "car",
                populate: [
                    {
                        path: "brand",
                        select: "name slug",
                    },
                    {
                        path: "category",
                        select: "name slug",
                    },
                    {
                        path: "features",
                        select: "name icon",
                    },
                ],
            },
        });

    if (!payment) {
        throw new ApiError(404, "Payment not found.");
    }

    const isOwner =
        payment.user._id.toString() === userId.toString();

    const isAdmin = role === "admin";

    if (!isOwner && !isAdmin) {
        throw new ApiError(
            403,
            "You are not authorized to access this payment."
        );
    }

    return payment;
};