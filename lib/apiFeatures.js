class APIFeatures {
    constructor(model, initialQuery) {
        this.model = model;
        this.initialQuery = initialQuery;
    }

    filter() {
        const queryObj = { ...this.initialQuery };
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => {
            delete queryObj[el]; // Important: Deleting property from object
        });

        let initialQuery = JSON.stringify(queryObj);
        initialQuery = initialQuery.replace(
            /\b(gte|gt|lte|lt|ne)\b/g,
            (match) => `$${match}`
        ); // Remark: \b for matching exact word!
        this.query = this.model.find(JSON.parse(initialQuery)); // Important: Note: await is not used so it doesn't execute the query only create the query object and storing it in this.query!

        return this;
    }

    sort() {
        if (this.initialQuery.sort) {
            // sort("price ratingsAverage")
            // /api/v1/tours?price[gt]=500&ratingsAverage[gte]=4.5&sort=price,difficulty
            const sortBy = this.initialQuery.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
            // query = query.sort(req.query.sort);
        } else {
            this.query = this.query.sort("_id"); // Important: MongoDB does not store documents in a collection in a particular order. So to prevent duplicate results must use atleast one unique field.
        }

        return this;
    }

    limitFields() {
        if (this.initialQuery.fields) {
            const fields = this.initialQuery.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v"); // Note: Excluding __v with this "-"!
        }

        return this;
    }

    paginate() {
        const page = this.initialQuery.page * 1 || 1;
        const limit = this.initialQuery.limit * 1 || 100;
        const skip = limit * (page - 1);
        this.query = this.query.skip(skip).limit(limit);

        // if (this.initialQuery.page) {
        //     const numTours = await Tour.countDocuments();
        //     if (skip >= numTours) throw new Error("This page does not exist!");
        // }
        return this;
    }
}

module.exports = APIFeatures;
