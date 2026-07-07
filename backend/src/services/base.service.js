import ApiError from "../utils/ApiError.js";

class BaseService {
    constructor(Model) {
        this.Model = Model;
    }

    async create(data) {
        return await this.Model.create(data);
    }

    async getAll(filter = {}, options = {}) {
        return await this.Model
            .find(filter)
            .sort(options.sort || { createdAt: -1 });
    }

    async getById(id) {
        const item = await this.Model.findById(id);

        if (!item) {
            throw new ApiError(404, "Resource not found");
        }

        return item;
    }

    async update(id, data) {
        const item = await this.Model.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!item) {
            throw new ApiError(404, "Resource not found");
        }

        return item;
    }

    async delete(id) {
        const item = await this.Model.findByIdAndDelete(id);

        if (!item) {
            throw new ApiError(404, "Resource not found");
        }

        return item;
    }
}

export default BaseService;