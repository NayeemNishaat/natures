const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");

dotenv.config({ path: `${__dirname}/../../config.env` }); // Note: If __dirname is not used then we need to run the script from it's absolute path to import other files in it.

const DB = process.env.DB_MONGOOSE;

mongoose.connect(DB).then(() => {
    // console.log("DB connection successful!");
});

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

const importData = async () => {
    try {
        await Tour.create(tours);
        // console.log("Imported!");
    } catch (err) {
        // console.log(err);
    }

    process.exit();
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        // console.log("Deleted!");
    } catch (err) {
        // console.log(err);
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
