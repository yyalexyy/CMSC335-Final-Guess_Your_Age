const express = require('express');
let router = express.Router();

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const db = process.env.MONGO_DB_NAME;
const dbCollection = process.env.MONGO_COLLECTION;

/* Our database and collection */
const databaseAndCollection = {db: db, collection: dbCollection};
const {MongoClient, ServerApiVersion} = require('mongodb');

/* Get Name and Age from db and display in a table */
router.get("/", async function (request, response) {
    const uri = `mongodb+srv://${userName}:${password}@cluster0.oe2gw.mongodb.net/${db}?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1
    });

    try {
        await client.connect();
        const result = await lookUpMany(client, databaseAndCollection);

        let sorted = result.sort((a, b) => b.age - a.age)
        let tableBody = "";
        sorted.forEach((ele, index) => tableBody += `<tr><td>${index + 1}</td><td>${ele.name}</td><td>${ele.age}</td></tr>`);

        let variable = {
            userBody: tableBody
        };
        response.render("leaderboard", variable);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});

/* Look up all data in db */
async function lookUpMany(client, databaseAndCollection) {
    let filter = {};
    const cursor = client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .find(filter);

    let result = await cursor.toArray();
    if (result === null) {
        result = {
            name: "N/A",
            age: "N/A"
        };
    }

    return result;
}

module.exports = router;