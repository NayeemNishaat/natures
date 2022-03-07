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

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);

    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime
        // results: tours.length,
        // data: {
        //     tours
        // }
    });
};

exports.getTour = (req, res) => {
    // console.log(req.params);

    const id = req.params.id * 1; // Point: Another trick to convert from string to number (js performs type casting to number).

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
    // await TourModel.create({data});

    // Point: MongoDB
    let client;
    try {
        client = await unresolvedClient();
    } catch (err) {
        console.log(err);
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

exports.updateTour = (req, res) => {
    // if (+req.params.id > tours.length) {
    //     return res.status(404).json({ status: "fail", message: "Invalid Id" });
    // }

    res.status(200).json({
        status: "success",
        data: { tour: "<Updated tour here!>" }
    });
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: "success",
        data: null
    });
};
