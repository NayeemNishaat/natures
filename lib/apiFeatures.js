class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => {
            delete queryObj[el]; // Important: Deleting property from object
        });

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        ); // Remark: \b for matching exact word!
        this.query = this.query.find(JSON.parse(queryString));

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            // sort("price ratingsAverage")
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
            // query = query.sort(req.query.sort);
        } else {
            this.query = this.query.sort("-createdAt");
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v"); // Note: Excluding __v with this "-"!
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = limit * (page - 1);
        this.query = this.query.skip(skip).limit(limit);

        // if (this.queryString.page) {
        //     const numTours = await Tour.countDocuments();
        //     if (skip >= numTours) throw new Error("This page does not exist!");
        // }
        return this;
    }
}

module.exports = APIFeatures;
