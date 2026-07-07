import BaseController from "./base.controller.js";
import BrandService from "../services/brand.service.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

class BrandController extends BaseController {
    constructor() {
        super(BrandService, "Brands");
    }

    create = asyncHandler(async (req, res) => {
        const brand = await BrandService.createBrand(req.body);

        res.status(201).json(
            new ApiResponse(
                201,
                "Brand created successfully",
                brand
            )
        );
    });
}

export default new BrandController();