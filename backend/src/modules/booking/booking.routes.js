import express from "express";

import {
    createBookingController,
    getBookingByIdController,
    getMyBookingsController,
    getAllBookingsController,
    cancelBookingController,
    updateBookingStatusController,
    getPendingBookingsController,
    confirmBookingController,
    rejectBookingController,
    deleteBookingController,
} from "./booking.controller.js";

import { protect, authorize } from "../../middleware/auth.middleware.js";
import validateRequest from "../../middleware/validateRequest.js";
import { USER_ROLES } from "../../constants/index.js";

import {
    createBookingValidation,
    cancelBookingValidation,
    updateBookingStatusValidation,
    confirmBookingValidation,
    rejectBookingValidation,
} from "./booking.validation.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Customer Routes
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    protect,
    authorize(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN),
    validateRequest(createBookingValidation),
    createBookingController
);

router.get(
    "/my-bookings",
    protect,
    authorize(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN),
    getMyBookingsController
);

router.get(
    "/:bookingId",
    protect,
    getBookingByIdController
);

router.patch(
    "/:bookingId/cancel",
    protect,
    validateRequest(cancelBookingValidation),
    cancelBookingController
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    protect,
    authorize(USER_ROLES.ADMIN),
    getAllBookingsController
);

router.patch(
    "/:bookingId/status",
    protect,
    authorize(USER_ROLES.ADMIN),
    validateRequest(updateBookingStatusValidation),
    updateBookingStatusController
);

// router.patch(
//     "/:bookingId/payment-status",
//     protect,
//     authorize(USER_ROLES.ADMIN),
//     validateRequest(updatePaymentStatusValidation),
//     updatePaymentStatusController
// );

router.delete(
    "/:bookingId",
    protect,
    authorize(USER_ROLES.ADMIN),
    deleteBookingController
);

router.get(
    "/pending",
    protect,
    authorize(USER_ROLES.ADMIN),
    getPendingBookingsController
);

router.patch(
    "/:bookingId/confirm",
    protect,
    authorize(USER_ROLES.ADMIN),
    validateRequest(confirmBookingValidation),
    confirmBookingController
);

router.patch(
    "/:bookingId/reject",
    protect,
    authorize(USER_ROLES.ADMIN),
    validateRequest(rejectBookingValidation),
    rejectBookingController
);

export default router;