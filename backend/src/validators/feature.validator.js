import { body } from "express-validator";

export const createFeatureValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Feature name is required"),

    body("icon")
        .optional()
        .trim(),

    body("description")
        .optional()
        .trim(),
];