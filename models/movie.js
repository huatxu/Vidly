const Joi = require('joi')
const mongoose = require('mongoose')

// Mongoose Schema

const genreSchemaMongoose = mongoose.Schema({
    name: {type: String, required: true, minLength: 5, maxLength: 255}
})

const MovieSchemaMongoose = mongoose.Schema({
    title: {
        type: String, 
        required: true, 
        minLength: 2, 
        maxLength: 255, 
        trim: true 
    },
    numberInStock: {
        type: Number, 
        required: true, 
        min: 0,
        default: 0 
    },
    dailyRentalRate: {
        type: Number, 
        required: true, 
        min: 0,
        default: 0
    },
    genre: {
        type: genreSchemaMongoose,
        required: true,
    }
})

const Movie = mongoose.model('Movie', MovieSchemaMongoose)

// Joi Schemas

const movieSchema = {
    title: Joi.string().required().min(2).max(255),
    numberInStock: Joi.number().required().min(0),
    dailyRentalRate: Joi.number().required().min(0), 
    genreID: Joi.objectId().required()
}

function validate(movie) {
    return Joi.validate(movie, movieSchema)
}

module.exports.Movie = Movie;
module.exports.validate = validate;
