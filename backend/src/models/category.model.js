import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
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

        description: {
            type: String,
            default: "",
            trim: true,
        },

        image: {
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

categorySchema.pre("save", function () {
    this.slug = slugify(this.name, {
        lower: true,
        strict: true,
    });

});

export default mongoose.model("Category", categorySchema);