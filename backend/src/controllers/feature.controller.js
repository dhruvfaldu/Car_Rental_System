import BaseController from "./base.controller.js";
import FeatureService from "../services/feature.service.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

class FeatureController extends BaseController {
    constructor() {
        super(FeatureService, "Features");
    }

    create = asyncHandler(async (req, res) => {
        const feature = await FeatureService.createFeature(req.body);

        res.status(201).json(
            new ApiResponse(
                201,
                "Feature created successfully",
                feature
            )
        );
    });
}

export default new FeatureController();