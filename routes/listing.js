const express = require("express");
const router = express.Router();
const Listing = require("../model/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const { listingSchema } = require("../schema.js");
// const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");


//Index route
router.get("/",
    wrapAsync(listingController.index)
);

//new route
router.get("/new", isLoggedIn,
    listingController.renderNewForm);

//show route
router.get("/:id",
    wrapAsync(listingController.show));

//create route
router.post("/", isLoggedIn, validateListing,
    wrapAsync(listingController.addnewListing)
);

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,
    wrapAsync(listingController.edit)
);

//update route
router.put("/:id",validateListing,isLoggedIn,isOwner,
    wrapAsync(listingController.update)
);

//Delete Route
router.delete("/:id",isLoggedIn,isOwner,
    wrapAsync(listingController.delete)
);

module.exports = router;