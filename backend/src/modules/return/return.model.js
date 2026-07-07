import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
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

        returnDate: {
            type: Date,
            required: true,
            default: Date.now,
        },

        returnLocation: {
            type: String,
            required: true,
            trim: true,
        },

        odometerEnd: {
            type: Number,
            required: true,
            min: 0,
        },

        fuelLevel: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        damageImages: [
            {
                public_id: String,
                secure_url: String,
            },
        ],

        damageNotes: {
            type: String,
            trim: true,
            default: "",
        },

        lateHours: {
            type: Number,
            default: 0,
            min: 0,
        },

        extraKM: {
            type: Number,
            default: 0,
            min: 0,
        },

        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Return = mongoose.model("Return", returnSchema);

export default Return;
