import Feature from "../models/feature.model.js";
import BaseService from "./base.service.js";
import ApiError from "../utils/ApiError.js";

class FeatureService extends BaseService {
    constructor() {
        super(Feature);
    }

    async createFeature(data) {
        const exists = await Feature.findOne({
            name: data.name,
        });

        if (exists) {
            throw new ApiError(409, "Feature already exists");
        }

        return this.create(data);
    }
}

export default new FeatureService();