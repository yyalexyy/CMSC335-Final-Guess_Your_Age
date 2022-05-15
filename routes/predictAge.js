const express = require('express');

let router = express.Router();

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const db = process.env.MONGO_DB_NAME;
const dbCollection = process.env.MONGO_COLLECTION;

/* Our database and collection */
const databaseAndCollection = {db: db, collection: dbCollection};
const { MongoClient, ServerApiVersion } = require('mongodb');

/* Display predictAge page */
router.get("/", (request, response) => {
    response.render("predictAge");
});

/* Save name and age into db */
router.post("/", async function(request, response) {
    
    let {fName, lName, backgroundInformation} =  request.body;
    const age = await AGIFY_API_GET(fName);


    const uri = `mongodb+srv://${userName}:${password}@cluster0.oe2gw.mongodb.net/${db}?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    let user = {
        name: fName + " " + lName,
        age: age
    };

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

/* Inser user to db */
async function insertApplicant(client, databaseAndCollection, user) {
    await client.db(databaseAndCollection.db)
            .collection(databaseAndCollection.collection)
            .insertOne(user);
}


/* Pass in name and fetch age from AGIFY API */
const fetch = require('node-fetch');
async function AGIFY_API_GET(name) {
    let age;

    await fetch(`https://api.agify.io?name=${name}`)
        .then(response => response.json())
        .then(json => {age = json.age})
        .catch(error => console.log("Error: " + error));

    // if age is null, we generate a random number btw 1 (inclusive) ~ 101 (exclusive)
    if(age === null) {
        age = Math.random() * (101 - 1) + 1;
    }

    return age;
}


module.exports = router;