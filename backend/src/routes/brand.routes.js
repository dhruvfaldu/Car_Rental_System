import { Router } from "express";

import BrandController from "../controllers/brand.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import upload from "../middleware/upload.middleware.js";

import { createBrandValidator } from "../validators/brand.validator.js";

const router = Router();

/**
 * Public Routes
 */

// Get all brands
router.get("/", BrandController.getAll);

// Get single brand
router.get("/:id", BrandController.getById);

/**
 * Admin Routes
 */

// Create brand
router.post(
    "/",
    protect,
    authorize("admin"),
    upload.single("logo"),
    createBrandValidator,
    validate,
    BrandController.create
);

// Update brand
router.put(
    "/:id",
    protect,
    authorize("admin"),
    upload.single("logo"),
    createBrandValidator,
    validate,
    BrandController.update
);

// Delete brand
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    BrandController.delete
);

export default router;