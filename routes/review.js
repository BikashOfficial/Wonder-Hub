const express = require("express");
const router = express.Router({ mergeParams: true });
//to merge the the parameter of parent with child use mergeParams - true
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../model/review.js");
const Listing = require("../model/listing.js");


//joi
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}


//post route
router.post("/",
    validateReview,
    wrapAsync(
        async (req, res) => {
            let listing = await Listing.findById(req.params.id);
            let newReview = new Review(req.body.review);

            listing.reviews.push(newReview);

            await newReview.save();
            await listing.save();

            console.log("new review saved!");
            res.redirect(`/listings/${listing._id}`)

        }));

// delete review route
router.delete("/:reviewId",
    wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params;

        let result = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        //pull basically find  instance of a value or values that match some specific condition from the and remove that from an existing array
        let del = await Review.findByIdAndDelete(reviewId);
        // console.log(result);
        // console.log(del);
        console.log("review deleted");
        res.redirect(`/listings/${id}`);
    })
);
module.exports = router;