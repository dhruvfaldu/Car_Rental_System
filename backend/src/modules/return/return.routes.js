import { Router } from "express";
import * as returnController from "./return.controller.js";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import validateRequest from "../../middleware/validateRequest.js";
import { createReturnValidation } from "./return.validation.js";
import upload from "../../middleware/upload.middleware.js";

const router = Router();

router.post(
    "/",
    protect,
    authorize("admin", "staff"),
    upload.array("images", 5),
    validateRequest(createReturnValidation),
    returnController.createReturn
);

router.get(
    "/:id",
    protect,
    returnController.getReturnById
);

router.get(
    "/booking/:bookingId",
    protect,
    returnController.getReturnByBookingId
);

export default router;
