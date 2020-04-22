const mongoose = require("mongoose")
const Joi = require("joi")
const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const { Genre } = require("../models/genres")
const { validate, Movie } = require("../models/movie")
const isAdmin = require("../middleware/admin")

// Routes

router.get("/", async (request, response) => {
    return response.send( await Movie.find().sort({ name: 1 }))
})

router.get("/:id", async (request, response) => {
    const id = request.params.id

    if ( !mongoose.Schema.Types.ObjectId.isValid(id) ) return response.sendStatus(404) 
    return response.send( await Movie.findById(id) )
})

router.post("/", auth, async (request, response) => {
    const { error } = validate(request.body)
    if ( error ) return response.status(400).send(error.details[0].message)

    const genre = await Genre.findById(request.body.genreID)
    if ( !genre ) return response.status(400).send("Invalid Genre ID")
    
    const exist = await Movie.findOne({name : request.body.name}).count() > 0    
    if ( exist ) return response.status(400).send("Movie already exists")
        
    const movie = await new Movie({
        title: request.body.title,
        numberInStock: request.body.numberInStock,
        dailyRentalRate: request.body.dailyRentalRate,
        genre: {
            _id: genre._id, 
            name: genre.name 
        }
    }).save()
        
    return response.send(movie)
})

router.put("/:id", auth, async (request, response) => {
    const id = request.params.id

    const { error } = validate(request.body)
    if( error ) return response.status(400).send(error.details[0].message)

    if ( !mongoose.Schema.Types.ObjectId.isValid(id) ) return response.sendStatus(404) 
    const movie = await Movie.findById(id)

    const update = await movie.set(request.body).save()
    return response.status(200).send(update)
})

router.delete("/:id", auth, isAdmin, async (request, response) => {
    const id = request.params.id
    if ( !mongoose.Schema.Types.ObjectId.isValid(id) ) return response.sendStatus(404) 

    const movie = await Movie.findByIdAndDelete(id)
    if ( movie ) return response.send(movie)
        
    return response.sendStatus(404)
})

module.exports = router