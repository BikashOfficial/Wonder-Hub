const express = require("express");
const router = express.Router();
const Listing = require("../model/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const { listingSchema } = require("../schema.js");
// const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//new route
router.get("/new", isLoggedIn,
    listingController.renderNewForm);

//router.route()
router
    .route("/")
    //Index route           
    .get(wrapAsync(listingController.index))
    //create route
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.addnewListing)
    );

// .post(, function (req, res, next) {
//     // req.file is the `avatar` file
//     // req.body will hold the text fields, if there were any
    // res.send(req.file);
// });

router.route("/:id")
    //show route
    .get(wrapAsync(listingController.show))
    //update route
    .put(isLoggedIn, isOwner,upload.single("listing[image]"),validateListing,
        wrapAsync(listingController.update))
    //Delete Route
    .delete(isLoggedIn, isOwner,
        wrapAsync(listingController.delete));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner,
    wrapAsync(listingController.edit));

module.exports = router;