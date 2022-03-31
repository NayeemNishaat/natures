// const { MongoClient } = require("mongodb");

// Chapter: MongoDB Driver
// module.exports = async () => {
//     const client = await MongoClient.connect(process.env.DB_LOCAL);
//     return client;
// console.log(client);

// Part: Insert Data
// const tourData = {
//     name: "The Forest Hiker",
//     rating: 4.7,
//     price: 497
// };

// try {
//     await db.collection("natures").insertOne(tourData);
// } catch (err) {
//     console.log(err);
// }

// Part: Delete Data
// await db.collection("natures").deleteOne({ price: 497 });

// Part: Get Data
// const data = await db.collection("natures").find({}).toArray();
// console.log(data);
// };

const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require("./userModel"); // No need for referencing but for embedding from another model.
// const validator = require("validator");

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "A tour must have a name"],
            unique: true,
            trim: true,
            maxlength: [
                40,
                "A tour name must have less or equal then 40 characters"
            ],
            minlength: [
                10,
                "A tour name must have more or equal then 10 characters"
            ]
            // validate: [validator.isAlpha, 'Tour name must only contain characters']
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, "A tour must have a duration"]
        },
        maxGroupSize: {
            type: Number,
            required: [true, "A tour must have a group size"]
        },
        difficulty: {
            type: String,
            required: [true, "A tour must have a difficulty"],
            enum: {
                // Point: String only validator. match also available to string for matching a regular expression.
                values: ["easy", "medium", "difficult"],
                message: "Difficulty is either: easy, medium, difficult"
            }
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            // min/max also works for dates too.
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be below 5.0"],
            set: (val) => Math.round(val * 10) / 10 // Remark: Setter function that will run each time when ratingsAverage receives a new value.
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, "A tour must have a price"]
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    // Important: this only points to current doc on NEW document creation not on document update!
                    return val < this.price;
                },
                message:
                    "Discount price ({VALUE}) should be below regular price"
            }
        },
        summary: {
            type: String,
            trim: true,
            required: [true, "A tour must have a description"]
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, "A tour must have a cover image"]
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false
        },
        startLocation: {
            // GeoJSON
            type: {
                type: String,
                default: "Point",
                enum: ["Point"]
            },
            coordinates: [Number],
            address: String,
            description: String
        },
        locations: [
            // Embedding locations without creating any model.
            {
                type: {
                    type: String,
                    default: "Point",
                    enum: ["Point"]
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number
            }
        ],
        // Point: Embedding guides from User model. (Not a good idean. Because when we need to update a guide to lead guide we need to update it for all the tours where he/she is a guide and also in the user collection.)
        // guides: Array
        // Point: Referencing guides
        guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }]
    },
    {
        // id: false, // Warning: If we want to use virtual-populate we mustn't set id/_id to false.
        // Remark: To use virtual properties we need to define these.
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Chapter: Index
// tourSchema.index({ price: 1 }); // Note: Single field index!
tourSchema.index({ price: 1, ratingsAverage: -1 }); // Note: Compound field index!
tourSchema.index({ slug: 1 });
// Important: Dont create index for a field that is mostly written (high write/read ratio).

// Chapter: Virtual Middleware
// Part: Virtual Field
tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
});

// Part: Virtual Populate
tourSchema.virtual("reviews", {
    ref: "Review", // Note: Name of the model!
    foreignField: "tour",
    localField: "_id"
});

// Chapter: DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre("save", function (next) {
    // this -> current document
    this.slug = slugify(this.name, { lower: true });
    next();
});

// Part: Embedding will only work for save/create documents not updating.
// tourSchema.pre("save", async function (next) {
// this -> current document
// req -> "guides":["123","1234567"]
// const guidesPromises = this.guides.map(
//     async (id) => await User.findById(id)
// ); // Important: map() is not async so it will return an array of promises though we have used await. So we need to manually settle the promises!

//     this.guides = await Promise.all(guidesPromises);

//     next();
// });

// Important: Here "save" is the hook/pre save hook!
// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// Chapter: QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function (next) {
    // Note: Here this -> query object
    // Point: This pre find hook runs before executing the query and after creation of the query.
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

tourSchema.pre(/^find/, function (next) {
    // Note: Current query is "this" i.e. -> Tour.findById(req.params.id)
    this.populate({
        path: "guides", // Name of the key to populate.
        select: "-__v -passwordChangedAt"
    }); // .populate("reviews"); // Important: Not populating here because we dont want to show reviews when the user requests for all tours. Rateher we will populate for a specific tour.

    next();
});

// tourSchema.post(/^find/, (_docs, next) =>
// Remark: It has access to the returned documents because it runs after executing the query.
// console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//     next()
// );

// Chapter: AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
    // Note: Here this -> aggregation object.
    // Remark: unshift to insert an element in the beginning of the array.
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

    // console.log(this.pipeline());
    next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

// Point: Business Logic > busyMonth, duration in week etc.
// Point: Application Logic -> req and response handeling etc.

// No model middleware because it's not very useful.
