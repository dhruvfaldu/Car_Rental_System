import Brand from "../models/brand.model.js";
import BaseService from "./base.service.js";
import ApiError from "../utils/ApiError.js";
import { uploadImage, deleteImage } from "./cloudinary.service.js";

class BrandService extends BaseService {
    constructor() {
        super(Brand);
    }


    async createBrand(data, file) {
        const exists = await Brand.findOne({
            name: data.name,
        });

        if (exists) {
            throw new ApiError(409, "Brand already exists");
        }

        if (file) {
            const logo = await uploadImage(file, "car-rental/brands");
            data.logo = logo;
        }

        return this.create(data);
    }

    async updateBrand(id, data, file) {
        const brand = await Brand.findById(id);
        if (!brand) {
            throw new ApiError(404, "Brand not found");
        }

        if (data.name) {
            const exists = await Brand.findOne({
                name: data.name,
                _id: { $ne: id },
            });
            if (exists) {
                throw new ApiError(409, "Brand name already exists");
            }
        }

        if (file) {
            if (brand.logo && brand.logo.public_id) {
                await deleteImage(brand.logo.public_id);
            }
            const logo = await uploadImage(file, "car-rental/brands");
            data.logo = logo;
        }

        Object.assign(brand, data);
        await brand.save();
        return brand;
    }

    async delete(id) {
        const brand = await Brand.findById(id);
        if (!brand) {
            throw new ApiError(404, "Brand not found");
        }

        if (brand.logo && brand.logo.public_id) {
            await deleteImage(brand.logo.public_id);
        }

        return await Brand.findByIdAndDelete(id);
    }
}

export default new BrandService();