// const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Important: Must be placed before executing any other code!
process.on("uncaughtException", (err) => {
    // Remark: Uncaught Exceptions are synchronous errors.
    console.log("Uncaught Exception! Shutting down!");
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: `${__dirname}/config.env` }); // Important: Note: This two lines should be on top because we need to set the environment variable at first before starting the app!

const app = require(`./app`);

// console.log(app.get("env"));
// console.log(process.env);
// console.log(process.env.NODE_ENV);

// Chapter: MongoDB Driver
// (async () => {
//     const client = await MongoClient.connect(process.env.DB_LOCAL);
// console.log(client);

// const db = client.db();

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

//     console.log(data);
// })();

const DB = process.env.DB_MONGOOSE;

mongoose
    .connect(DB)
    .then(() => {
        // console.log("DB connection successful!");
    })
    .catch(() => {
        // console.log("DB connection failed!");
    });

const port = process.env.port || 8080;

const server = app.listen(port, () => {
    // console.log(`App listening on port ${port}.`);
});

process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection! Shutting down!");
    console.log(err.name, err.message);
    server.close(() => process.exit(1)); // Note: 1 -> Uncaught exception, 0 -> Success.
});

// Chapter: With Mongoose
// const DB = DB_CONNECTION_STRING;
// mongoose
//     .connect(DB, {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useFindAndModify: true
//     })
//     .then(() => "Connected");

// const tourSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "A tour must have a name"],
//         unique: true
//     },
//     rating: { type: Number, dafault: 4.5 },
//     price: {
//         type: Number,
//         required: [true, "A tour must have a price"]
//     }
// });
// const TourModel = mongoose.model("TourModel", tourSchema);

// const testTour = new TourModel({
//     name: "The Forest Hiker",
//     rating: 4.7,
//     price: 497
// });

// testTour.save();

// Colors springgreen, gold, dodgerblue, deeppink, blueviolet
