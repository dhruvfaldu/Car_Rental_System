import { Router } from "express";

import FeatureController from "../controllers/feature.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import { createFeatureValidator } from "../validators/feature.validator.js";

const router = Router();

router.get("/", FeatureController.getAll);

router.get("/:id", FeatureController.getById);

router.post(
    "/",
    protect,
    authorize("admin"),
    createFeatureValidator,
    validate,
    FeatureController.create
);

router.put(
    "/:id",
    protect,
    authorize("admin"),
    createFeatureValidator,
    validate,
    FeatureController.update
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    FeatureController.delete
);

export default router;