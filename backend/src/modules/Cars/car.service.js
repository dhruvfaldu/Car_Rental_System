import mongoose from "mongoose";
import Brand from "../../models/brand.model.js";
import Category from "../../models/category.model.js";
import Feature from "../../models/feature.model.js";
import Car from "./car.model.js";
import { Booking } from "../booking/booking.model.js";
import { BOOKING_STATUS } from "../booking/booking.constant.js";

import ApiError from "../../utils/ApiError.js";
import { deleteMultipleImages, uploadMultipleImages } from "../../services/cloudinary.service.js";
import { normalizeUniqueArray } from "../../utils/array.util.js";
import QueryBuilder from "../../utils/queryBuilder.js";

class CarService {

    async getCars(queryParams) {
        const query = { ...queryParams };

        if (query.brand && !mongoose.Types.ObjectId.isValid(query.brand)) {
            const brandObj = await Brand.findOne({
                $or: [
                    { name: { $regex: `^${query.brand}$`, $options: "i" } },
                    { slug: query.brand.toLowerCase() }
                ]
            });
            query.brand = brandObj ? brandObj._id : new mongoose.Types.ObjectId();
        }

        if (query.category && !mongoose.Types.ObjectId.isValid(query.category)) {
            const catObj = await Category.findOne({
                $or: [
                    { name: { $regex: `^${query.category}$`, $options: "i" } },
                    { slug: query.category.toLowerCase() }
                ]
            });
            query.category = catObj ? catObj._id : new mongoose.Types.ObjectId();
        }

        const builder = new QueryBuilder(
            Car.find({ isActive: true }),
            query
        )
            .search(["name"])
            .filter()
            .sort();

        // Count BEFORE pagination
        const total = await Car.countDocuments(
            builder.query.getFilter()
        );

        builder.paginate();

        const cars = await builder.query
            .populate("brand", "name")
            .populate("category", "name")
            .populate("features", "name icon");

        return {
            cars,
            total,
            page: builder.page,
            limit: builder.limit,
        };
    }

    async getCarById(id) {

        const car = await Car.findById(id)
            .populate("brand", "name slug")
            .populate("category", "name slug")
            .populate("features", "name icon");

        if (!car) {
            throw new ApiError(404, "Car not found");
        }

        const bookings = await Booking.find({
            car: car._id,
            bookingStatus: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PICKED_UP] }
        }).select("pickupDate returnDate").lean();

        const carObj = car.toObject ? car.toObject() : car;
        carObj.bookedDates = bookings;

        return carObj;
    }

    async getCarBySlug(slug) {
        const car = await Car.findOne({ slug })
            .populate("brand", "name slug")
            .populate("category", "name slug")
            .populate("features", "name icon");

        if (!car) {
            throw new ApiError(404, "Car not found");
        }

        const bookings = await Booking.find({
            car: car._id,
            bookingStatus: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PICKED_UP] }
        }).select("pickupDate returnDate").lean();

        const carObj = car.toObject ? car.toObject() : car;
        carObj.bookedDates = bookings;

        return carObj;
    }

    async updateCar(id, data, files) {

        const car = await Car.findById(id);

        if (!car) {
            throw new ApiError(404, "Car not found");
        }

        // Validate brand
        if (data.brand) {
            await this.validateBrand(data.brand);
        }

        // Validate category
        if (data.category) {
            await this.validateCategory(data.category);
        }

        // Validate features
        if (data.features) {
            data.features = await this.validateFeatures(data.features);
        }

        // Registration Number
        if (
            data.registrationNumber &&
            data.registrationNumber !== car.registrationNumber
        ) {

            const exists = await Car.findOne({
                registrationNumber: data.registrationNumber
            });

            if (exists) {
                throw new ApiError(
                    409,
                    "Registration number already exists"
                );
            }

        }

        // Delete selected images
        if (data.deletedImages) {

            const deletedImages = Array.isArray(data.deletedImages)
                ? data.deletedImages
                : [data.deletedImages];

            await deleteMultipleImages(deletedImages);

            car.images = car.images.filter(
                image =>
                    !deletedImages.includes(image.public_id)
            );

        }

        // Upload new images
        if (files?.length) {

            const uploaded = await this.uploadImages(files);

            car.images.push(...uploaded);

        }

        Object.assign(car, data);

        await car.save();

        return car;

    }

    //delete car
    async deleteCar(id) {
        const car = await Car.findById(id);
        if (!car) {
            throw new ApiError(
                404,
                "Car not found"
            );
        }

        const publicIds = car.images.map(
            image => image.public_id
        );

        await deleteMultipleImages(publicIds);

        await car.deleteOne();

    }

    //validate brand, category, features, registration number, and upload images
    async validateBrand(brandId) {
        const brand = await Brand.findById(brandId);

        if (!brand) {
            throw new ApiError(404, "Brand not found");
        }

        return brand;
    }

    async validateCategory(categoryId) {
        const category = await Category.findById(categoryId);

        if (!category) {
            throw new ApiError(404, "Category not found");
        }

        return category;
    }

    async validateFeatures(features) {

        features = normalizeUniqueArray(features);

        if (!features.length) {
            return [];
        }

        const total = await Feature.countDocuments({
            _id: {
                $in: features,
            },
        });

        if (total !== features.length) {
            throw new ApiError(400, "Invalid feature selected");
        }

        return features;
    }

    async validateRegistrationNumber(registrationNumber) {

        const exists = await Car.findOne({
            registrationNumber,
        });

        if (exists) {
            throw new ApiError(
                409,
                "Registration number already exists"
            );
        }
    }

    async uploadImages(files) {

        if (!files || files.length === 0) {
            throw new ApiError(
                400,
                "At least one image is required"
            );
        }

        if (files.length > 5) {
            throw new ApiError(
                400,
                "Maximum 5 images allowed"
            );
        }

        return await uploadMultipleImages(
            files,
            "car-rental/cars"
        );
    }


    async createCarDocument(data) {
        return await Car.create(data);
    }

    async createCar(data, files) {

        await Promise.all([
            this.validateBrand(data.brand),
            this.validateCategory(data.category),
            this.validateRegistrationNumber(data.registrationNumber),
        ]);

        data.features = await this.validateFeatures(
            data.features
        );

        data.images = await this.uploadImages(files);

        return await this.createCarDocument(data);
    }
}

export default new CarService();