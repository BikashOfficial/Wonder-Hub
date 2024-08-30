const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const methodeOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderHub';

main()
    .then(() => {
        console.log("CONNECTED TO DB...");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodeOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

//Error handling middleware
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
    let { status = 500, message = "Something Went Worng!" } = err;
    // res.status(status).send(message);
    res.render("error.ejs", { err })
});

app.listen(8080, () => {
    console.log("server is listening to port  8080");
});