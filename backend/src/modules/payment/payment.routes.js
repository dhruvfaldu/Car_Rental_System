import { Router } from "express";

import * as paymentController from "./payment.controller.js";

import { protect, authorize } from "../../middleware/auth.middleware.js";


import validateRequest from "../../middleware/validateRequest.js";

import {
    createPaymentValidation,
    verifyPaymentValidation,
    refundPaymentValidation,
} from "./payment.validation.js";

const router = Router();

router.post(
    "/",
    protect,
    validateRequest(createPaymentValidation),
    paymentController.createPayment
);

router.post(
    "/:paymentId/order",
    protect,
    paymentController.createOrder
);

router.post(
    "/verify",
    protect,
    validateRequest(verifyPaymentValidation),
    paymentController.verifyPayment
);

router.get(
    "/my-payments",
    protect,
    paymentController.getMyPayments
);

router.get(
    "/:paymentId",
    protect,
    paymentController.getPaymentById
);

router.get(
    "/",
    protect,
    authorize("admin"),
    paymentController.getAllPayments
);

router.post(
    "/:paymentId/refund",
    protect,
    authorize("admin"),
    validateRequest(refundPaymentValidation),
    paymentController.refundPayment
);

export default router;