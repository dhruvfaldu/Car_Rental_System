import { body } from "express-validator";

export const createBrandValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Brand name is required"),
];