const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./model/listing.js");
const path = require('path');
const methodeOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

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

//joi
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

app.get("/", (req, res) => {
    res.send("Hi, i am root");
});
//Index route
app.get("/listings",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    }));

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
});

//show route
app.get("/listings/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/show.ejs", { listing });
    }));

//create route
app.post("/listings",
    validateListing,
    wrapAsync(async (req, res) => {
        // if (!req.body.listing) {
        //     throw new ExpressError(400, "PLease Send valid Data from listings!")
        // }
        // let { title, description, image, price, country, location } = req.body;
        // let listing = req.body.listing;
        // console.log(listing);
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    }));

//edit route
app.get("/listings/:id/edit",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        // console.log(res);
        res.render("listings/edit.ejs", { listing });
    }));

//update route
app.put("/listings/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        // {...req.body.listing} takes all the key-value pairs from req.body.listing and spreads them out as separate properties within a new object.
        res.redirect(`/listings/${id}`);
    }));

//Delete Route
app.delete("/listings/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        res.redirect("/listings");
    }));

//Error handling middleware
app.all("*", (req, res, next) => {
    next( new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
    let { status = 500, message = "Something Went Worng!" } = err;
    // res.status(status).send(message);
    res.render("error.ejs", { err })
});

app.listen(8080, () => {
    console.log("server is listening to port  8080");
});