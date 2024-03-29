const fs = require("fs/promises");
const catchAsync = require("../lib/catchAsync");
const APIFeatures = require("../lib/apiFeatures");
const AppError = require("../lib/appError");

// exports.deleteOne = (Model, ModelDependency) =>
//     catchAsync(async (req, res) => {
//         // await Model.findByIdAndDelete(req.params.id);

//         if (ModelDependency) {
//             // await ModelDependency.deleteMany({ tour: req.params.id });
//         }

//         res.status(200).json({
//             status: "success",
//             data: null
//         });
//     });

exports.delete = (Model, ModelDependency) =>
    catchAsync(async (req, res) => {
        await Model.deleteMany({ _id: req.body.docId || req.params.id }); // Remark: Always use "_id" for fields not "id". "id" can only be used for value.

        if (ModelDependency) {
            await ModelDependency.deleteMany({
                [Model.modelName.toLowerCase()]: req.body.docId || req.params.id
            });
        }

        if (Model.modelName === "Tour") {
            try {
                let deletableFiles;

                const files = await fs.readdir(
                    `${__dirname}/../public/img/tours`
                );

                if (req.body.tourSlug.constructor === Array) {
                    deletableFiles = req.body.tourSlug
                        .map((slug) =>
                            files.filter((file) => file.includes(slug))
                        )
                        .flat();
                } else
                    deletableFiles = files.filter((file) =>
                        file.includes(req.body.tourSlug)
                    );

                deletableFiles.forEach(
                    async (df) =>
                        await fs.unlink(
                            `${__dirname}/../public/img/tours/${df}`
                        )
                );
            } catch (err) {
                console.log(err);
            }
        }

        res.status(200).json({
            status: "success",
            data: null
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!doc) {
            return next(
                new AppError("No document found with the given id", 404)
            );
        }

        res.status(200).json({
            status: "success",
            data: {
                doc
            }
        });
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res) => {
        const doc = await Model.create(req.body);

        doc.__v = undefined;
        doc.createdAt = undefined;

        res.status(201).json({
            status: "success",
            data: {
                doc
            }
        });
    });

// Remark: Populate is only for getOne()
exports.getOne = (Model, populateOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id); // Note: Not executing right away rather saving in a variable to manipulate it later.

        if (populateOptions) query = query.populate(populateOptions);

        const doc = await query; // Important: Executing by awaiting!

        if (!doc) {
            return next(
                new AppError("No document found with the given id", 404)
            );
        }

        res.status(200).json({
            status: "success",
            data: {
                doc
            }
        });
    });

exports.getAll = (Model, populateOption) =>
    catchAsync(async (req, res) => {
        // Warning: Hack to allow for nested  GET reviews on tour best would be using a middleware but a middleware will be too much for the two lines of code. But I changed my mind. Using middleware! 😉 Sorry my bad, middleware can only manipulate req/res object not other thing i.e. Model! So will use a helper function for this.
        // let filter = {};
        // if (req.params.id) filter = { tour: req.params.id };

        // const features = new APIFeatures(Model.find(filter), req.query)

        // if (req.fltr) Model = Model.find();
        // console.log(req.fltr);

        // Part: First build the query!
        const features = new APIFeatures(Model.find(req.fltr), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        // Part: Then execute the query by using await!

        // Important: Executionstatistics
        // const doc = await features.query.explain(); Use index to make quering much more efficient!

        const doc = await features.query.populate(populateOption);

        res.status(200).json({
            status: "success",
            results: doc.length,
            data: {
                doc
            }
        });
    });

// Key: API Documentation
// https://documenter.getpostman.com/view/19820088/UVyrUGZK
