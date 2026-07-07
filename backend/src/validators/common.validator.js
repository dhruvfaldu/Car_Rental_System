import { param } from "express-validator";

export const mongoIdValidator = (field = "id") => [
    param(field)
        .isMongoId()
        .withMessage(`Invalid ${field}`),
];