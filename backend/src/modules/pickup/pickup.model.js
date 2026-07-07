import mongoose from "mongoose";

const pickupSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true,
        },

        car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
            required: true,
        },

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        pickupDate: {
            type: Date,
            required: true,
            default: Date.now,
        },

        pickupLocation: {
            type: String,
            required: true,
            trim: true,
        },

        odometerStart: {
            type: Number,
            required: true,
            min: 0,
        },

        fuelLevel: {
            type: Number,
            required: true,
            min: 0,
            max: 100, // percentage (0 - 100)
        },

        images: [
            {
                public_id: String,
                secure_url: String,
            },
        ],

        notes: {
            type: String,
            trim: true,
            default: "",
        },

        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        signature: {
            public_id: {
                type: String,
                default: "",
            },
            secure_url: {
                type: String,
                default: "",
            },
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Pickup = mongoose.model("Pickup", pickupSchema);

export default Pickup;
