const Joi = require("joi")
const mongoose = require("mongoose")

const movieSchemaMongoose = mongoose.Schema({
    title: {
        type: String, 
        required: true, 
        minLength: 4, 
        maxLength: 255}
})

const customerSchemaMongoose = mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        minLength: 4, 
        maxLength: 255}
})

const rentalSchemaMongoose = mongoose.Schema({
    movie: {
        type: movieSchemaMongoose,
        required: true
    },
    customer: {
        type: customerSchemaMongoose,
        required: true
    },
    date: {
        type: Date, 
        default: Date.now, 
    }
})

const Rental = mongoose.model("Rental", rentalSchemaMongoose)

const rentalSchema = {
    customerID: Joi.objectId().required(),
    movieID: Joi.objectId().required(),
    date: Joi.date()
}

function validate(rental) {
    return Joi.validate(rental, rentalSchema)
}

module.exports.validate = validate
module.exports.Rental = Rental