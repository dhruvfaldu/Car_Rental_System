class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search(fields = []) {
        if (this.queryString.search && fields.length) {
            this.query = this.query.find({
                $or: fields.map(field => ({
                    [field]: {
                        $regex: this.queryString.search,
                        $options: "i",
                    },
                })),
            });
        }

        return this;
    }

    sort(defaultSort = "-createdAt") {
        if (this.queryString.sort) {
            this.query = this.query.sort(
                this.queryString.sort.split(",").join(" ")
            );
        } else {
            this.query = this.query.sort(defaultSort);
        }

        return this;
    }

    paginate(skip, limit) {
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

export default ApiFeatures;
