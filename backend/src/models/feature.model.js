import mongoose from "mongoose";
import slugify from "slugify";

const featureSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        slug: {
            type: String,
            unique: true,
        },

        icon: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            default: "",
            trim: true,
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

featureSchema.pre("save", function () {
    this.slug = slugify(this.name, {
        lower: true,
        strict: true,
    });

});

export default mongoose.model("Feature", featureSchema);