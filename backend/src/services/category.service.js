import Category from "../models/category.model.js";
import BaseService from "./base.service.js";
import ApiError from "../utils/ApiError.js";

class CategoryService extends BaseService {
    constructor() {
        super(Category);
    }

    async createCategory(data) {
        const exists = await Category.findOne({
            name: data.name,
        });

        if (exists) {
            throw new ApiError(409, "Category already exists");
        }

        return this.create(data);
    }
}

export default new CategoryService();