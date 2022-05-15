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
    response.render("predictAge");
});


router.post("/", async function(request, response) {
    const uri = `mongodb+srv://${userName}:${password}@cluster0.oe2gw.mongodb.net/${db}?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    let user = request.body;
    // let {fName, lName, backgroundInformation} =  request.body;

    // let user = {
    //     name: fName + lName,
    //     age: // get age from the api fetch
    // };

    try {
        await client.connect();
        await insertApplicant(client, databaseAndCollection, user);
        response.render("ageResult", user);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});

async function insertApplicant(client, databaseAndCollection, user) {
    await client.db(databaseAndCollection.db)
            .collection(databaseAndCollection.collection)
            .insertOne(user);
}


module.exports = router;