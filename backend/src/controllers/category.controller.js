import BaseController from "./base.controller.js";
import CategoryService from "../services/category.service.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

class CategoryController extends BaseController {
    constructor() {
        super(CategoryService, "Categories");
    }

    create = asyncHandler(async (req, res) => {
        const category = await CategoryService.createCategory(req.body);

        res.status(201).json(
            new ApiResponse(
                201,
                "Category created successfully",
                category
            )
        );
    });
}

export default new CategoryController();