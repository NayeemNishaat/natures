// const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Important: Must be placed before executing any other code!
process.on("uncaughtException", (err) => {
    // Remark: Uncaught Exceptions are synchronous errors.
    console.error("Uncaught Exception! Shutting down!");
    console.error(err.name, err.message);
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

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
    // console.log(`App listening on port ${port}.`);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection! Shutting down!");
    console.error(err.name, err.message);
    server.close(() => process.exit(1)); // Note: 1 -> Uncaught exception, 0 -> Success.
});

// Remark: Heroku sends SIGTERM signal everyday to restart the node application for better application health.
process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully!");

    // Note: Gracefully shutting down to complete all the pending requests.
    server.close(() => {
        console.log("Process terminated!");
    });
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

// Chapter: Deploy with Heroku
// Key: Login with "heroku login"
// Key: Define start npm script -> "start": "node server.js"
// Key: Define engine -> "engines": { "node": "=18.0.0"}
// Key: Set port by using "process.env.port"
// Key: Create project repo on heroku with "heroku create"
// Key: Push repo on heroku using "git push heroku main"
// Key: View error logs using "heroku logs --tail"
// Key: Open project with "heroku open"
// Key: Point: Set environment variable using "heroku config:set NODE_ENV=production"
// Key: Change application link with "heroku apps:rename natours"
// Key: Add remote repo and app -> "heroku git:remote -a natours-lby"
// Key: To check dyno use "heroku ps"
// Key: Restart dyno with "heroku ps:restart"
