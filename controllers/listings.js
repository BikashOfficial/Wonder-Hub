const Listing = require("../model/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.show = async (req, res) => {
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
};

module.exports.addnewListing = async (req, res) => {
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
};

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    // console.log(res);
    if (!listing) {
        req.flash("error", "listing you requested is not exist!");
        res.redirect(`/listings/${id}`);
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.update = async (req, res) => {
    let { id } = req.params;
    // let listing = await Listing.findById(id);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // {...req.body.listing} takes all the key-value pairs from req.body.listing and spreads them out as separate properties within a new object.
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};