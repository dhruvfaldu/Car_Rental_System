import { Router } from "express";

import CategoryController from "../controllers/category.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import { createCategoryValidator } from "../validators/category.validator.js";

const router = Router();

router.get("/", CategoryController.getAll);

router.get("/:id", CategoryController.getById);

router.post(
    "/",
    protect,
    authorize("admin"),
    createCategoryValidator,
    validate,
    CategoryController.create
);

router.put(
    "/:id",
    protect,
    authorize("admin"),
    createCategoryValidator,
    validate,
    CategoryController.update
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    CategoryController.delete
);

export default router;