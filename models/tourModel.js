const { MongoClient } = require("mongodb");

// Chapter: MongoDB Driver
module.exports = async () => {
    const client = await MongoClient.connect(process.env.DB_LOCAL);
    return client;
    // console.log(client);

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
    // console.log(data);
};
