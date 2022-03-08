const unresolvedClient = require("../models/tourModel");
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

exports.getAllTours = async (req, res) => {
    // Point: Mongoose
    // await testTour.find();

    // console.log(req.requestTime);

    let client;
    try {
        client = await unresolvedClient();
    } catch (err) {
        res.status(404).json({ status: "fail", message: err });
    }

    const db = client.db();

    try {
        const allTours = await db.collection("natours").find().toArray();

        client.close();

        res.status(200).json({
            status: "success",
            requestedAt: req.requestTime,
            results: allTours.length,
            data: {
                allTours
            }
        });
    } catch (err) {
        client.close();
        console.log(err);
    }
};

exports.getTour = async (req, res) => {
    // Point: Mongoose
    // await testTour.findById(+req.params.id);
    // testTour.findOne({_id:req.params.id})

    let client;
    try {
        client = await unresolvedClient();
    } catch (err) {
        res.status(404).json({ status: "fail", message: err });
    }

    const db = client.db();

    try {
        const tour = await db
            .collection("natours")
            .find({ id: +req.params.id })
            .toArray();

        client.close();

        res.status(200).json({
            status: "success",
            requestedAt: req.requestTime,
            data: {
                tour
            }
        });
    } catch (err) {
        client.close();
        console.log(err);
    }

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
};

exports.createTour = async (req, res) => {
    // Point: Mongoose
    // await testTour.create(req.body);

    // Point: MongoDB
    let client;
    try {
        client = await unresolvedClient();
    } catch (err) {
        res.status(404).json({ status: "fail", message: err });
    }

    const db = client.db();

    try {
        const newTour = await db.collection("natours").insertOne(req.body);

        client.close();

        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        client.close();
        console.log(err);
    }

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
};

exports.updateTour = async (req, res) => {
    // if (+req.params.id > tours.length) {
    //     return res.status(404).json({ status: "fail", message: "Invalid Id" });
    // }

    // Point: Mongoose
    // await testTour.findByIdAndUpdate(req.param.id,req.body,{new:true,runValidators:true});

    let client;
    try {
        client = await unresolvedClient();
    } catch (err) {
        res.status(404).json({ status: "fail", message: err });
    }

    const db = client.db();

    try {
        const tour = await db
            .collection("natours")
            .updateOne({ id: +req.params.id }, { $set: req.body });
        client.close();

        res.status(200).json({
            status: "success",
            requestedAt: req.requestTime,
            data: {
                tour
            }
        });
    } catch (err) {
        client.close();
        console.log(err);
    }
};

exports.deleteTour = async (req, res) => {
    let client;
    try {
        client = await unresolvedClient();
    } catch (err) {
        res.status(404).json({ status: "fail", message: err });
    }

    const db = client.db();

    try {
        await db.collection("natours").deleteOne({ id: +req.params.id });
        client.close();

        res.status(200).json({
            status: "success",
            requestedAt: req.requestTime,
            data: null
        });
    } catch (err) {
        client.close();
        console.log(err);
    }
};
