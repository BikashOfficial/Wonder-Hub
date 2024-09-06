const Listing = require("../model/listing.js");
const Review = require("../model/review");

module.exports.postReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved!");
    req.flash("success","review posted successfully!");
    res.redirect(`/listings/${listing._id}`)

};

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    let result = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    //pull basically find  instance of a value or values that match some specific condition from the and remove that from an existing array
    let del = await Review.findByIdAndDelete(reviewId);
    // console.log(result);
    // console.log(del);
    console.log("review deleted");
    req.flash("success", "review deleted successfully!");
    res.redirect(`/listings/${id}`);
};