import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

class BaseController {
    constructor(service, resourceName) {
        this.service = service;
        this.resourceName = resourceName;
    }

    getAll = asyncHandler(async (req, res) => {
        const data = await this.service.getAll();

        res.status(200).json(
            new ApiResponse(
                200,
                `${this.resourceName} fetched successfully`,
                data
            )
        );
    });

    getById = asyncHandler(async (req, res) => {
        const data = await this.service.getById(req.params.id);

        res.status(200).json(
            new ApiResponse(
                200,
                `${this.resourceName} fetched successfully`,
                data
            )
        );
    });

    update = asyncHandler(async (req, res) => {
        const data = await this.service.update(
            req.params.id,
            req.body
        );

        res.status(200).json(
            new ApiResponse(
                200,
                `${this.resourceName} updated successfully`,
                data
            )
        );
    });

    delete = asyncHandler(async (req, res) => {
        await this.service.delete(req.params.id);

        res.status(200).json(
            new ApiResponse(
                200,
                `${this.resourceName} deleted successfully`
            )
        );
    });
}

export default BaseController;