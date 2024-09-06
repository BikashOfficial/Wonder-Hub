const express = require("express");
const router = express.Router();
const Listing = require("../model/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const { listingSchema } = require("../schema.js");
// const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner ,validateListing} = require("../middleware.js");


//Index route
router.get("/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    })
);

//new route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//show route
router.get("/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate:{
                    path: "author",
                }
            })
            .populate("owner");
        if (!listing) {
            req.flash("error", "listing you requested is not exist!");
            res.redirect("/listings");
        }
        // console.log(listing);
        // console.log(listing.owner);
        res.render("listings/show.ejs", { listing });
    }));

//create route
router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {
        // if (!req.body.listing) {
        //     throw new ExpressError(400, "PLease Send valid Data from listings!")
        // }
        // let { title, description, image, price, country, location } = req.body;
        // let listing = req.body.listing;
        // console.log(listing);
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id; //save the current user to the new listing
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    })
);

//edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        // console.log(res);
        if (!listing) {
            req.flash("error", "listing you requested is not exist!");
            res.redirect(`/listings/${id}`);
        }
        res.render("listings/edit.ejs", { listing });
    })
);

//update route
router.put("/:id",
    validateListing,
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        // let listing = await Listing.findById(id);
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        // {...req.body.listing} takes all the key-value pairs from req.body.listing and spreads them out as separate properties within a new object.
        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    })
);

//Delete Route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success", "Listing deleted successfully!");
        res.redirect("/listings");
    })
);

module.exports = router;
