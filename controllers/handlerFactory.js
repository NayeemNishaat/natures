const catchAsync = require("../lib/catchAsync");
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
