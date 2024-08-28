const Joi = require("joi");
const joi = require("joi");
const review = require("./model/review");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required().min(0),
        country: joi.string().required(),
        location: joi.string().required(),
        image: joi.string().allow("", null),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});