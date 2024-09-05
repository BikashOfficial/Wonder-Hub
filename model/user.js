const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");



const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);
//passport-local-mongoose -- > creates passsowd and user name by default with saling and hashfunction
// also gives some useful authentication methods

module.exports = mongoose.model("User",userSchema);