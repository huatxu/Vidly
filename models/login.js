const Joi = require("joi")
const mongoose = require("mongoose")


const loginSchemaMongoose = mongoose.Schema({
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
    }
})

const Login = mongoose.model("Login", loginSchemaMongoose)

const loginSchema = {
    email: Joi.string().min(15).max(255).required(),
    password: Joi.string().min(6).max(128).required()
}

function validate (login) { 
    return Joi.validate(login, loginSchema)
}

module.exports.validate = validate
module.exports.Login = Login