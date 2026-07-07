import crypto from "crypto";

import ApiError from "../../../utils/ApiError.js";

export const verifySignature = ({
    orderId,
    paymentId,
    signature,
}) => {
    const generatedSignature = crypto
        .createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
        )
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

    if (generatedSignature !== signature) {
        throw new ApiError(
            400,
            "Invalid payment signature."
        );
    }

    return true;
};