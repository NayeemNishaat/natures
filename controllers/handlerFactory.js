const catchAsync = require("../lib/catchAsync");
const APIFeatures = require("../lib/apiFeatures");
const AppError = require("../lib/appError");

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(
                new AppError("No document found with the given id", 404)
            );
        }

        res.status(204).json({
            status: "success",
            data: null
        });
    });

// Bug: Need to Implement Authorization
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
    catchAsync(async (req, res, next) => {
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

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        // Warning: Hack to allow for nested  GET reviews on tour best would be using a middleware but a middleware will be too much for the two lines of code.
        let filter = {};
        if (req.params.id) filter = { tour: req.params.id };

        // Part: First build the query!
        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        // Part: Then execute the query by using await!
        const doc = await features.query;
        res.status(200).json({
            status: "success",
            results: doc.length,
            data: {
                doc
            }
        });
    });
