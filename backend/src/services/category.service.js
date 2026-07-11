import Category from "../models/category.model.js";
import BaseService from "./base.service.js";
import ApiError from "../utils/ApiError.js";
import { uploadImage, deleteImage } from "./cloudinary.service.js";

class CategoryService extends BaseService {
    constructor() {
        super(Category);
    }

    async createCategory(data, file) {
        const exists = await Category.findOne({
            name: data.name,
        });

        if (exists) {
            throw new ApiError(409, "Category already exists");
        }

        if (file) {
            const image = await uploadImage(file, "car-rental/categories");
            data.image = image;
        }

        return this.create(data);
    }

    async updateCategory(id, data, file) {
        const category = await Category.findById(id);
        if (!category) {
            throw new ApiError(404, "Category not found");
        }

        if (data.name) {
            const exists = await Category.findOne({
                name: data.name,
                _id: { $ne: id },
            });
            if (exists) {
                throw new ApiError(409, "Category name already exists");
            }
        }

        if (file) {
            if (category.image && category.image.public_id) {
                await deleteImage(category.image.public_id);
            }
            const image = await uploadImage(file, "car-rental/categories");
            data.image = image;
        }

        Object.assign(category, data);
        await category.save();
        return category;
    }

    async delete(id) {
        const category = await Category.findById(id);
        if (!category) {
            throw new ApiError(404, "Category not found");
        }

        if (category.image && category.image.public_id) {
            await deleteImage(category.image.public_id);
        }

        return await Category.findByIdAndDelete(id);
    }
}

export default new CategoryService();