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
const APIFeatures = require("../lib/apiFeatures");

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";
    next();
};

exports.getAllTours = async (req, res) => {
    try {
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
        // Part: Then execute the query!
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;

        // const tours = await Tour.find();

        // SEND RESPONSE
        res.status(200).json({
            status: "success",
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        // Tour.findOne({ _id: req.params.id })

        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        // const newTour = new Tour({})
        // newTour.save()

        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: "success",
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
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
                $sort: { avgPrice: 1 }
            }
            // {
            //   $match: { _id: { $ne: 'EASY' } }
            // }
        ]);

        res.status(200).json({
            status: "success",
            data: {
                stats
            }
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1; // 2021

        const plan = await Tour.aggregate([
            {
                $unwind: "$startDates"
            },
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
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            {
                $limit: 12
            }
        ]);

        res.status(200).json({
            status: "success",
            data: {
                plan
            }
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    // _id: "$difficulty", // Note: null -> All Fields
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
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try {
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
                        // _id -> group by!
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
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};
