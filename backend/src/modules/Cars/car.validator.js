import { body } from "express-validator";

export const createCarValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Car name is required"),

    body("brand")
        .isMongoId()
        .withMessage("Invalid brand"),

    body("category")
        .isMongoId()
        .withMessage("Invalid category"),

    body("year")
        .isInt({
            min: 2000,
            max: new Date().getFullYear() + 1,
        })
        .withMessage("Invalid year"),

    body("fuelType")
        .isIn([
            "Petrol",
            "Diesel",
            "Electric",
            "Hybrid",
            "CNG",
        ])
        .withMessage("Invalid fuel type"),

    body("transmission")
        .isIn(["Manual", "Automatic"])
        .withMessage("Invalid transmission"),

    body("seats")
        .isInt({ min: 2, max: 10 })
        .withMessage("Seats must be between 2 and 10"),

    body("registrationNumber")
        .trim()
        .notEmpty()
        .withMessage("Registration number is required"),

    body("pricePerDay")
        .isFloat({ min: 100 })
        .withMessage("Price must be greater than ₹100"),
];

export const updateCarValidator = [

    body("name").optional().trim(),

    body("brand").optional().isMongoId(),

    body("category").optional().isMongoId(),

    body("pricePerDay")
        .optional()
        .isFloat({ min: 100 }),

    body("registrationNumber")
        .optional()
        .trim(),

];