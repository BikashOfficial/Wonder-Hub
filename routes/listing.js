const express = require("express");
const router = express.Router();
const Listing = require("../model/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const { listingSchema } = require("../schema.js");
// const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");


//router.route()
router
    .route("/")
    //Index route
    .get(wrapAsync(listingController.index))
    //create route
    .post(
        isLoggedIn, validateListing,
        wrapAsync(listingController.addnewListing)
    );

router.route("/:id")
    //show route
    .get(wrapAsync(listingController.show))
    //update route
    .put(validateListing, isLoggedIn, isOwner,
        wrapAsync(listingController.update)
    )
    //Delete Route
    .delete(isLoggedIn, isOwner,
        wrapAsync(listingController.delete)
    );

//new route
router.get("/new", isLoggedIn,
    listingController.renderNewForm);

//edit route
router.get("/:id/edit", isLoggedIn, isOwner,
    wrapAsync(listingController.edit)
);

module.exports = router;