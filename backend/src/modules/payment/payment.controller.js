import asyncHandler from "../../utils/asyncHandler.js";

import ApiResponse from "../../utils/ApiResponse.js";

import * as paymentService from "./payment.service.js";

export const createPayment = asyncHandler(
    async (req, res) => {
        const payment =
            await paymentService.createPayment({

                bookingId: req.body.bookingId,

                userId: req.user._id,

                paymentMethod:
                    req.body.paymentMethod,

                paymentGateway:
                    req.body.paymentGateway,
            });

        return res.status(201).json(
            new ApiResponse(
                201,
                "Payment created successfully.",
                payment
            )
        );

    }
);

export const createOrder = asyncHandler(
    async (req, res) => {

        const order =
            await paymentService.createOrder({

                paymentId: req.params.paymentId,

            });

        return res.status(200).json(
            new ApiResponse(
                200,
                "Order created successfully.",
                order
            )
        );

    }
);

export const verifyPayment = asyncHandler(
    async (req, res) => {

        const payment =
            await paymentService.verifyPayment({

                paymentId:
                    req.body.paymentId,

                orderId:
                    req.body.orderId,

                razorpayPaymentId:
                    req.body.razorpayPaymentId,

                razorpaySignature:
                    req.body.razorpaySignature,

                gatewayResponse:
                    req.body.gatewayResponse,
            });

        return res.status(200).json(
            new ApiResponse(
                200,
                "Payment verified successfully.",
                payment
            )
        );

    }
);
export const refundPayment = asyncHandler(
    async (req, res) => {

        const payment =
            await paymentService.refundPayment({

                paymentId:
                    req.params.paymentId,

                refundAmount:
                    req.body.refundAmount,

                refundReason:
                    req.body.refundReason,
            });

        return res.status(200).json(
            new ApiResponse(
                200,
                "Refund processed successfully.",
                payment
            )
        );

    }
);

export const getMyPayments = asyncHandler(
    async (req, res) => {

        const result =
            await paymentService.getMyPayments({

                userId: req.user._id,

                ...req.query,
            });

        return res.status(200).json(
            new ApiResponse(
                200,
                "Payments fetched successfully.",
                result
            )
        );

    }
);

export const getPaymentById = asyncHandler(
    async (req, res) => {

        const payment =
            await paymentService.getPaymentById({

                paymentId:
                    req.params.paymentId,

                userId:
                    req.user._id,

                role:
                    req.user.role,
            });

        return res.status(200).json(
            new ApiResponse(
                200,
                "Payment fetched successfully.",
                payment
            )
        );

    }
);

export const getAllPayments = asyncHandler(
    async (req, res) => {

        const result =
            await paymentService.getAllPayments({

                queryParams: req.query,
            });

        return res.status(200).json(
            new ApiResponse(
                200,
                "Payments fetched successfully.",
                result
            )
        );

    }
);