import mongoose from "mongoose";
import slugify from "slugify";

const brandSchema = new mongoose.Schema(
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

        logo: {
            public_id: String,
            secure_url: String,
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

brandSchema.pre("save", function () {
    this.slug = slugify(this.name, {
        lower: true,
        strict: true,
    });
});

export default mongoose.model("Brand", brandSchema);