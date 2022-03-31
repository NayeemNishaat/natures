// const unresolvedClient = require("../models/tourModel");
// const fs = require("fs");

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// Important: In express always use middleware not function. That's the philosophy of express!
// exports.checkId = (req, res, next, val) => {
//     if (+req.params.id > tours.length) {
//         // Important: Must return
//         return res.status(404).json({ status: "fail", message: "Invalid Id" });
//     }
//     console.log(`Tour Id is ${val}`);

//     next();
// };

// exports.checkBody = (req, res, next) => {
//     const receivedData = req.body;

//     if (
//         !receivedData ||
//         !receivedData.name ||
//         receivedData.name === "" ||
//         !receivedData.price ||
//         receivedData.price === ""
//     )
//         return res
//             .status(400)
//             .json({ status: "fail", message: "Invalid Name and Price" });

//     next();
// };

// exports.getAllTours = async (req, res) => {
// Point: Mongoose
// await testTour.find();

// console.log(req.requestTime);

//     let client;
//     try {
//         client = await unresolvedClient();
//     } catch (err) {
//         res.status(404).json({ status: "fail", message: err });
//     }

//     const db = client.db();

//     try {
//         const allTours = await db.collection("natours").find().toArray();

//         client.close();

//         res.status(200).json({
//             status: "success",
//             requestedAt: req.requestTime,
//             results: allTours.length,
//             data: {
//                 allTours
//             }
//         });
//     } catch (err) {
//         client.close();
//         console.log(err);
//     }
// };

// exports.getTour = async (req, res) => {
//     // Point: Mongoose
//     // await testTour.findById(+req.params.id);
//     // testTour.findOne({_id:req.params.id})

//     let client;
//     try {
//         client = await unresolvedClient();
//     } catch (err) {
//         res.status(404).json({ status: "fail", message: err });
//     }

//     const db = client.db();

//     try {
//         const tour = await db
//             .collection("natours")
//             .find({ id: +req.params.id })
//             .toArray();

//         client.close();

//         res.status(200).json({
//             status: "success",
//             requestedAt: req.requestTime,
//             data: {
//                 tour
//             }
//         });
//     } catch (err) {
//         client.close();
//         console.log(err);
//     }

// console.log(req.params);
// const id = req.params.id * 1; // Point: Another trick to convert from string to number (js performs type casting to number).

// if (id > tours.length) {
//     return res.status(404).json({ status: "fail", message: "Invalid Id" });
// }

// const tour = tours.find((el) => el.id === id);

// if (!tour) {
//     return res.status(404).json({ status: "fail", message: "Invalid Id" });
// }

// res.status(200).json({
//     status: "success",
//     data: {
//         tour
//     }
// });
// };

// exports.createTour = async (req, res) => {
//     // Point: Mongoose
//     // await testTour.create(req.body);

//     // Point: MongoDB
//     let client;
//     try {
//         client = await unresolvedClient();
//     } catch (err) {
//         res.status(404).json({ status: "fail", message: err });
//     }

//     const db = client.db();

//     try {
//         const newTour = await db.collection("natours").insertOne(req.body);

//         client.close();

//         res.status(201).json({
//             status: "success",
//             data: {
//                 tour: newTour
//             }
//         });
//     } catch (err) {
//         client.close();
//         console.log(err);
//     }

// console.log(await db.collection("natours").find({}).toArray());

// console.log(req.body);
// const newId = tours[tours.length - 1].id + 1;
// const newTour = Object.assign({ id: newId }, req.body);
// tours.push(newTour);
// fs.writeFile(
//     `${__dirname}/../dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//         res.status(201).json({
//             status: "success",
//             data: {
//                 tour: newTour
//             }
//         });
//     }
// );
// res.status(200).send("Done!"); // Important: We must return a response.
// };

// exports.updateTour = async (req, res) => {
// if (+req.params.id > tours.length) {
//     return res.status(404).json({ status: "fail", message: "Invalid Id" });
// }

// Point: Mongoose
// await testTour.findByIdAndUpdate(req.param.id,req.body,{new:true,runValidators:true});

//     let client;
//     try {
//         client = await unresolvedClient();
//     } catch (err) {
//         res.status(404).json({ status: "fail", message: err });
//     }

//     const db = client.db();

//     try {
//         const tour = await db
//             .collection("natours")
//             .updateOne({ id: +req.params.id }, { $set: req.body });
//         client.close();

//         res.status(200).json({
//             status: "success",
//             requestedAt: req.requestTime,
//             data: {
//                 tour
//             }
//         });
//     } catch (err) {
//         client.close();
//         console.log(err);
//     }
// };

// exports.deleteTour = async (req, res) => {
//     let client;
//     try {
//         client = await unresolvedClient();
//     } catch (err) {
//         res.status(404).json({ status: "fail", message: err });
//     }

//     const db = client.db();

//     try {
//         await db.collection("natours").deleteOne({ id: +req.params.id });
//         client.close();

//         res.status(200).json({
//             status: "success",
//             requestedAt: req.requestTime,
//             data: null
//         });
//     } catch (err) {
//         client.close();
//         console.log(err);
//     }
// };

const Tour = require("../models/tourModel");
const catchAsync = require("../lib/catchAsync");
const AppError = require("../lib/appError");
const factory = require("./handlerFactory");

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";
    next();
};

exports.getAllTours = factory.getAll(Tour);

// Note: No error handeling for getAllTours because there couldn't be any error when requesting for all tours.
/* exports.getAllTours = catchAsync(async (req, res, next) => {
    // try {
    // EXECUTE QUERY
    // const features = new APIFeatures(Tour.find(), req.query)
    //     .filter()
    //     .sort()
    //     .limitFields()
    //     .paginate();

    // Point: Filtering Query
    // const tours = await Tour.find()
    //     .where("duration")
    //     .equals(5)
    //     .where("difficulty")
    //     .equals("easy");

    // const tours = await Tour.find({ duration: 5, difficulty: "easy" });

    // Part: Advanced Filtering
    // /tours?duration[gte]=5&difficulty=easy
    // const queryObj = { ...req.query };
    // const excludedFields = ["page", "sort", "limit", "fields"];
    // excludedFields.forEach((el) => {
    //     delete queryObj[el]; // Important: Deleting property from object
    // });

    // let queryString = JSON.stringify(queryObj);
    // queryString = queryString.replace(
    //     /\b(gte|gt|lte|lt)\b/g,
    //     (match) => `$${match}`
    // ); // Remark: \b for matching exact word!
    // let query = Tour.find(JSON.parse(queryString));

    // Part: Sorting with chain
    // /tours?sort=-price // Note: Descending Order
    // /tours?sort=price,ratingsAverage
    // if (req.query.sort) {
    //     // sort("price ratingsAverage")
    //     const sortBy = req.query.sort.split(",").join(" ");
    //     query = query.sort(sortBy);
    //     // query = query.sort(req.query.sort);
    // } else {
    //     query = query.sort("-createdAt");
    // }

    // Part: Field Limitting
    // /tours?fields=name,duration,difficulty,price
    // if (req.query.fields) {
    //     const fields = req.query.fields.split(",").join(" ");
    //     query = query.select(fields);
    // } else {
    //     query = query.select("-__v"); // Note: Excluding __v with this "-"!
    // }

    // Part: Pagination
    // /tours?page=2&limit=10 // Note: 1 - 10 for page 1 and 11-20 for page 2.
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = limit * (page - 1);
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //     const numTours = await Tour.countDocuments();
    //     if (skip >= numTours) throw new Error("This page does not exist!");
    // }

    // const tours = await Tour.find(queryObj);
    // Part: First build the query!
    // const query = Tour.find(queryObj); // Important: Without await it will return a query. With await it will return a resolved result of the current query.
    const features = new APIFeatures(Tour, req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    // Part: Then execute the query!
    const tours = await features.query; // Important: Remark: This query object is APIFeatures class's query object. And it's mutated over and over again by the filter(), sort(), limitFields() etc methods. Note: the final query looks like this: tour.find().sort().select().skip().limit() // Important: Without await it will return a query. With await it will return a resolved result of the current query.
    // const tours = await Tour.query();

    // SEND RESPONSE
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours
        }
    });
    // } catch (err) {
    //     res.status(404).json({
    //         status: "fail",
    //         message: err
    //     });
    // }
}); */

exports.getTour = factory.getOne(Tour, { path: "reviews" });

// exports.getTour = catchAsync(async (req, res, next) => {
//     // try {
//     const tour = await Tour.findById(req.params.id).populate("reviews");

// if (!tour) {
//     return next(new AppError("No tour found with the given id", 404)); // Important: The next middleware is the error handeling middleware because we passed something inside next("something")!
// }
// Tour.findOne({ _id: req.params.id })

// res.status(200).json({
//     status: "success",
//     data: {
//         tour
//     }
// });
// } catch (err) {
//     res.status(404).json({
//         status: "fail",
//         message: err
//     });
// }
// });

exports.createTour = factory.createOne(Tour);

// exports.createTour = catchAsync(async (req, res, next) => {
//     const newTour = await Tour.create(req.body);

//     res.status(201).json({
//         status: "success",
//         data: {
//             tour: newTour
//         }
//     });

// try {
// const newTour = new Tour({})
// newTour.save()

// const newTour = await Tour.create(req.body);

// res.status(201).json({
//     status: "success",
//     data: {
//         tour: newTour
//     }
// });
// } catch (err) {
//     res.status(400).json({
//         status: "fail",
//         message: err
//     });
// }
// });

exports.updateTour = factory.updateOne(Tour);

// exports.updateTour = catchAsync(async (req, res, next) => {
//     // try {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     });

//     if (!tour) {
//         return next(new AppError("No tour found with the given id", 404));
//     }

//     res.status(200).json({
//         status: "success",
//         data: {
//             tour
//         }
//     });
// } catch (err) {
//     res.status(404).json({
//         status: "fail",
//         message: err
//     });
// }
// });

exports.deleteTour = factory.deleteOne(Tour); // Important: Remark: Not using factory.deleteOne("Tour")() because we dont call this function. It is express who will call this whenever a request to this route initiated.

/* exports.deleteTour = catchAsync(async (req, res, next) => {
    // try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
        return next(new AppError("No tour found with the given id", 404));
    }

    res.status(204).json({
        status: "success",
        data: null
    });
    // } catch (err) {
    //     res.status(404).json({
    //         status: "fail",
    //         message: err
    //     });
    // }
}); */

// Segment: Aggrigation Middleware
exports.getTourStats = catchAsync(async (req, res, next) => {
    // try {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                // _id: "$difficulty", // Note: null -> no group. Consider All document's specific field for calculation.
                _id: { $toUpper: "$difficulty" },
                numTours: { $sum: 1 },
                numRatings: { $sum: "$ratingsQuantity" },
                avgRating: { $avg: "$ratingsAverage" },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" }
            }
        },
        {
            $sort: {
                avgPrice: 1
            }
        },
        {
            $match: {
                _id: { $ne: "EASY" } // "EASY" because the "easy" is not available at this point. The documnent is changed here.
            }
        }
    ]);

    res.status(200).json({
        status: "success",
        data: {
            stats
        }
    });
    // } catch (err) {
    //     res.status(404).json({
    //         status: "fail",
    //         message: err
    //     });
    // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    // try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate(
        // Note: Unwind will deconstruct an array for the specified field and creates a document for each element in the array.
        [
            { $unwind: "$startDates" },
            // Point: $match is used for selecting a document.
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$startDates" },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: "$name" }
                }
            },
            {
                $addFields: { month: "$_id" }
            },
            {
                $project: { _id: 0 }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            { $limit: 6 },
            {
                $group: {
                    // _id: null -> group by null that means no group!
                    _id: null,
                    busyMonth: { $max: "$numTourStarts" }
                }
            }
        ]
    );

    res.status(200).json({
        status: "success",
        data: {
            plan
        }
    });
    // } catch (err) {
    //     res.status(404).json({
    //         status: "fail",
    //         message: err
    //     });
    // }
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;

    const [lat, lng] = latlng.split(",");

    if (!lat || !lng) {
        next(
            new AppError(
                "Please provide latitude and longitude in the format lat,lng.",
                400
            )
        );
    }

    // Note: Radius should be in radian
    const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        stats: "success",
        results: tours.length,
        data: { tours }
    });
});

// Note: Generally aggregation pipeline is used for calculation!
exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;

    const [lat, lng] = latlng.split(",");

    if (!lat || !lng) {
        next(
            new AppError(
                "Please provide latitude and longitude in the format lat,lng.",
                400
            )
        );
    }

    const multiplier = unit === "mi" ? 0.000621371 : 0.001;

    const distances = await Tour.aggregate([
        {
            // Important: $geoNear must be the first stage.
            // Warning: It requires one of the field to be geo-spatial index. If multiple fields with geo-spatial index, then keys parameter need to be used to define the field that should be used for calculations. Remark: For only one geo-spatial index field we don't need to define keys.
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [+lng, lat * 1] // Note: Converting to number.
                },
                distanceField: "distance", // Remark: Name of the field that will be create where all of the calculated distances will be stored.
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);

    res.status(200).json({
        stats: "success",
        data: { distances }
    });
});
