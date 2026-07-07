import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import CarService from "./car.service.js";
import createPagination from "../../utils/pagination.js";

class CarController {

    create = asyncHandler(async (req, res) => {

        const car = await CarService.createCar(
            req.body,
            req.files
        );

        res.status(201).json(
            new ApiResponse(
                201,
                "Car created successfully",
                car
            )
        );
    });

    getAll = asyncHandler(async (req, res) => {
        const result = await CarService.getCars(req.query);
        const pagination = createPagination({
            total: result.total,
            page: result.page,
            limit: result.limit,
        });

        res.status(200).json(
            new ApiResponse(
                200,
                "Cars fetched successfully",
                result.cars,
                pagination
            )
        );

    });

    getById = asyncHandler(async (req, res) => {

        const car = await CarService.getCarById(
            req.params.id
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Car fetched successfully",
                car
            )
        );

    });

    update = asyncHandler(async (req, res) => {

        const car = await CarService.updateCar(
            req.params.id,
            req.body,
            req.files
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Car updated successfully",
                car
            )

        );

    });
    delete = asyncHandler(async (req, res) => {

        await CarService.deleteCar(
            req.params.id
        );

        res.status(200).json(

            new ApiResponse(
                200,
                "Car deleted successfully"
            )

        );

    });

}

export default new CarController();