import { Router } from "express";

import CarController from "./car.controller.js";

import upload from "../../middleware/upload.middleware.js";

import validate from "../../middleware/validate.middleware.js";
import { protect, authorize } from "../../middleware/auth.middleware.js";

import { createCarValidator, updateCarValidator } from "./car.validator.js";
import { mongoIdValidator } from "../../validators/common.validator.js";

const router = Router();

router.post(
    "/",
    protect,
    authorize("admin"),
    upload.array("images", 5),
    createCarValidator,
    validate,
    CarController.create
);

router.get("/", CarController.getAll);

router.get("/slug/:slug", CarController.getBySlug);

router.get(
    "/:id",
    mongoIdValidator(),
    validate,
    CarController.getById
);

router.put(
    "/:id",
    protect,
    authorize("admin"),
    mongoIdValidator(),
    upload.array("images", 5),
    updateCarValidator,
    validate,
    CarController.update
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    mongoIdValidator(),
    validate,
    CarController.delete
);

export default router;