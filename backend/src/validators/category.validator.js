import { body } from "express-validator";

export const createCategoryValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required"),

    body("description")
        .optional()
        .trim(),
];