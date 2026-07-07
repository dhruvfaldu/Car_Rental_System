import { Router } from "express";
import * as pickupController from "./pickup.controller.js";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import validateRequest from "../../middleware/validateRequest.js";
import { createPickupValidation } from "./pickup.validation.js";
import upload from "../../middleware/upload.middleware.js";

const router = Router();

router.post(
    "/",
    protect,
    authorize("admin", "staff"),
    upload.array("images", 5),
    validateRequest(createPickupValidation),
    pickupController.createPickup
);

router.get(
    "/:id",
    protect,
    pickupController.getPickupById
);

router.get(
    "/booking/:bookingId",
    protect,
    pickupController.getPickupByBookingId
);

export default router;
