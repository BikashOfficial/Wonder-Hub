const express = require("express");
const router = express.Router({ mergeParams: true });
//to merge the the parameter of parent with child use mergeParams - true
// const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const { reviewSchema } = require("../schema.js");
const Review = require("../model/review.js");
const Listing = require("../model/listing.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//post route
router.post("/", isLoggedIn, validateReview,
    wrapAsync(reviewController.postReview));

// delete review route
router.delete("/:reviewId", isAuthor, isLoggedIn,
    wrapAsync(reviewController.deleteReview)
);
module.exports = router;