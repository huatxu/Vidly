const Joi = require("joi")
const mongoose = require("mongoose")

const customerSchemaMongoose = mongoose.Schema({
    isGold : {
        type: Boolean, 
        required: true
    },
    phone: {
        type: String, 
        required: true, 
        minLength: 5, 
        maxLength: 20}, 
    name: {
        type: String, 
        required: true, 
        minLength: 3, 
        maxLength: 255}, 
})

const Customer = mongoose.model("Customer", customerSchemaMongoose)

// Joi schemas

const customerSchema = {
    isGold: Joi.boolean().required(),
    phone: Joi.string().min(5).max(20).required(),
    name: Joi.string().min(3).max(255).required()
}

function validate (customer) {
    return Joi.validate(customer, customerSchema)
}

module.exports.Customer = Customer
module.exports.validate = validate