const express = require('express');
let router = express.Router();

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const db = process.env.MONGO_DB_NAME;
const dbCollection = process.env.MONGO_COLLECTION;

/* Our database and collection */
const databaseAndCollection = {db: db, collection: dbCollection};
const { MongoClient, ServerApiVersion } = require('mongodb');

router.get("/", (request, response) => {
    response.render("leaderboard");
});


router.post("/", async function(request, response) {
    const uri = `mongodb+srv://${userName}:${password}@cluster0.oe2gw.mongodb.net/${db}?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    // let {fName, age} = request.body;

    try {
        await client.connect();
        const res = await lookUpMany(client, databaseAndCollection);

        let tableBody = "";
        res.forEach(ele => tableBody += `<tr><td>${ele.name}</td><td>${ele.age}</td></tr>`);

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

async function lookUpMany(client, databaseAndCollection) {
    let filter = {};
    const cursor = client.db(databaseAndCollection.db)
    .collection(databaseAndCollection.collection)
    .find(filter);

    let result = await cursor.toArray();
    if(result === null) {
        result = {
            name: "N/A",
            age: "N/A"
        };
    }

    return result;
}

module.exports = router;