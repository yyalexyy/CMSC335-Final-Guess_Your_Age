const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
let app = express();

require("dotenv").config({path: path.resolve(__dirname, 'credentials/.env')});

const predictAge = require("./routes/predictAge");
const leaderboard = require("./routes/leaderboard");


app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({extended: false}));

let portNumber = process.env.PORT || 5000;
app.locals.portNumber = portNumber;

process.stdout.write(`Web server started and running at http://localhost:${portNumber}\n`);


app.use("/predictAge", predictAge);
app.use("/processAge", predictAge);
app.use("/leaderboard", leaderboard);

app.get("/", (request, response) => {
    response.render("index");
});

app.listen(portNumber);