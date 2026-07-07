import mongoose from "mongoose";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { CAR_STATUS, CAR_STATUS_VALUES } from "./car.constant.js";

const carSchema = new mongoose.Schema(
    {
        carId: {
            type: String,
            unique: true,
            default: () => `CAR-${nanoid(8).toUpperCase()}`,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            unique: true,
        },

        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
            required: true,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        features: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Feature",
            },
        ],

        year: {
            type: Number,
            required: true,
        },

        fuelType: {
            type: String,
            enum: [
                "Petrol",
                "Diesel",
                "Electric",
                "Hybrid",
                "CNG",
            ],
            required: true,
        },

        transmission: {
            type: String,
            enum: [
                "Manual",
                "Automatic",
            ],
            required: true,
        },

        seats: {
            type: Number,
            required: true,
        },

        color: String,

        mileage: Number,

        registrationNumber: {
            type: String,
            unique: true,
            required: true,
            uppercase: true,
            trim: true,
        },

        pricePerDay: {
            type: Number,
            required: true,
        },

        securityDeposit: {
            type: Number,
            default: 0,
        },

        allowedKMPerDay: {
            type: Number,
            default: 200,
        },

        pricePerKM: {
            type: Number,
            default: 15,
        },

        lateFeePerHour: {
            type: Number,
            default: 150,
        },

        fuelChargePercentage: {
            type: Number,
            default: 50,
        },

        description: {
            type: String,
            default: "",
        },

        images: [
            {
                public_id: String,
                secure_url: String,
            },
        ],

        isFeatured: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: CAR_STATUS_VALUES,
            default: CAR_STATUS.AVAILABLE,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

carSchema.pre("save", function () {
    this.slug = slugify(
        `${this.name}-${this.carId}`,
        {
            lower: true,
            strict: true,
        }
    );

});

export default mongoose.model("Car", carSchema);