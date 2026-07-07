import Brand from "../models/brand.model.js";
import BaseService from "./base.service.js";
import ApiError from "../utils/ApiError.js";

class BrandService extends BaseService {
    constructor() {
        super(Brand);
    }


    async createBrand(data) {
        const exists = await Brand.findOne({
            name: data.name,
        });

        if (exists) {
            throw new ApiError(409, "Brand already exists");
        }

        return this.create(data);
    }
}

export default new BrandService();