import BaseController from "./base.controller.js";
import BrandService from "../services/brand.service.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

class BrandController extends BaseController {
    constructor() {
        super(BrandService, "Brands");
    }

    create = asyncHandler(async (req, res) => {
        const brand = await BrandService.createBrand(req.body, req.file);

        res.status(201).json(
            new ApiResponse(
                201,
                "Brand created successfully",
                brand
            )
        );
    });

    update = asyncHandler(async (req, res) => {
        const brand = await BrandService.updateBrand(
            req.params.id,
            req.body,
            req.file
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Brand updated successfully",
                brand
            )
        );
    });
}

export default new BrandController();