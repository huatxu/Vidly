const Joi = require ("joi")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const config = require("config")

const userSchemaMongoose = mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        minLength: 3, 
        maxLength: 255
    },
    email: {
        type: String,
        required: true, 
        minLength: 15,
        maxLength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true, 
        minLength: 6,
        maxLength: 128
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

userSchemaMongoose.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("jwt-private-key"))
}


const User = mongoose.model("User", userSchemaMongoose)


const userSchema = {
    name: Joi.string().required().min(3).max(255),
    email: Joi.string().email().required().min(15).max(255),
    password: Joi.string().min(6).max(128).required()
}

function validate(user) { 
    return Joi.validate(user, userSchema)
}

module.exports.validate = validate
module.exports.User = User