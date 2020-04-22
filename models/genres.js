const Joi = require("joi")
const mongoose = require("mongoose")

const genreSchemaMongoose = mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        minLength: 4, 
        maxLength: 255}
})

const Genre = mongoose.model("Genre", genreSchemaMongoose);

const genreSchema = {
    name: Joi.string().min(4).required()
}

function validate(genre) {
    return Joi.validate(genre, genreSchema)
}

module.exports.validate = validate
module.exports.Genre = Genre