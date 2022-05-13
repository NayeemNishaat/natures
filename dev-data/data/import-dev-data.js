const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");
const User = require("../../models/userModel");
const Review = require("../../models/reviewModel");

dotenv.config({ path: `${__dirname}/../../config.env` }); // Note: If __dirname is not used then we need to run the script from it's absolute path to import other files in it.

const DB = process.env.DB_MONGOOSE;

mongoose.connect(DB).then(() => {
    // console.log("DB connection successful!");
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

const importData = async () => {
    try {
        // await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        // await Review.create(reviews);
        console.log("Imported!");
    } catch (err) {
        console.error(err);
    }

    process.exit();
};

const deleteData = async () => {
    try {
        // await Tour.deleteMany();
        await User.deleteMany();
        // await Review.deleteMany();
        console.log("Deleted!");
    } catch (err) {
        console.error(err);
    }

    process.exit();
};

// console.log(process.argv);

if (process.argv[2] === "--import") {
    importData();
}
if (process.argv[2] === "--delete") {
    deleteData();
}

// node ./dev-data/data/import-dev-data.js --import
