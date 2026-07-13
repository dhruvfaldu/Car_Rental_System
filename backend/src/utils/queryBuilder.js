class QueryBuilder {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;

        this.page = Number(queryString.page) || 1;
        this.limit = Number(queryString.limit) || 10;
    }

    search(fields = []) {
        if (this.queryString.search) {
            this.query = this.query.find({
                $or: fields.map((field) => ({
                    [field]: {
                        $regex: this.queryString.search,
                        $options: "i",
                    },
                })),
            });
        }

        return this;
    }

    filter() {
        const filter = {};

        if (this.queryString.brand)
            filter.brand = this.queryString.brand;

        if (this.queryString.category)
            filter.category = this.queryString.category;

        if (this.queryString.isFeatured !== undefined) {
            filter.isFeatured = this.queryString.isFeatured === "true" || this.queryString.isFeatured === true;
        }

        const fuelTypeParam = this.queryString.fuelType || this.queryString.fuel;
        if (fuelTypeParam) {
            const values = fuelTypeParam.split(",");
            filter.fuelType = { $in: values.map(v => new RegExp(`^${v}$`, "i")) };
        }

        if (this.queryString.transmission) {
            const values = this.queryString.transmission.split(",");
            filter.transmission = { $in: values.map(v => new RegExp(`^${v}$`, "i")) };
        }

        if (this.queryString.status)
            filter.status = this.queryString.status;

        if (this.queryString.seats)
            filter.seats = Number(this.queryString.seats);

        if (this.queryString.minPrice || this.queryString.maxPrice) {
            filter.pricePerDay = {};

            if (this.queryString.minPrice)
                filter.pricePerDay.$gte = Number(this.queryString.minPrice);

            if (this.queryString.maxPrice)
                filter.pricePerDay.$lte = Number(this.queryString.maxPrice);
        }

        this.query = this.query.find(filter);

        return this;
    }

    sort() {
        let sort = this.queryString.sort || "-createdAt";
        if (sort === "newest") {
            sort = "-createdAt";
        }

        this.query = this.query.sort(sort);

        return this;
    }

    paginate() {
        const skip = (this.page - 1) * this.limit;

        this.query = this.query.skip(skip).limit(this.limit);

        return this;
    }
}

export default QueryBuilder;