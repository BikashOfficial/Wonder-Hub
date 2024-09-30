const Listing = require("../model/listing");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

module.exports.index = async (req, res) => {
    const search = req.query.search;
    console.log(search);
    if (search) {
        const allListings = await Listing.find({country: `${search}`});
        res.render("listings/index.ejs", { allListings });
    }
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
            populate: {
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

module.exports.addnewListing = async (req, res, next) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "PLease Send valid Data from listings!")
    // }
    // let { title, description, image, price, country, location } = req.body;
    // let listing = req.body.listing;
    // console.log(listing);
    let { category , title} = req.body;
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,"..",filename);
    const newListing = new Listing(req.body.listing);
    newListing.category = `${category}`; 
    newListing.owner = req.user._id; //save the current user to the new listing
    newListing.image = { url, filename };
    // console.log(category);
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
        res.redirect(`/listings`);
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.update = async (req, res) => {
    let { id } = req.params;
    // let listing = await Listing.findById(id);
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // {...req.body.listing} takes all the key-value pairs from req.body.listing and spreads them out as separate properties within a new object.
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
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