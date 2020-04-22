const express = require("express")
require("express-async-errors")
const Joi = require("joi")
const mongoose = require("mongoose")
const router = express.Router()
const { validate, Genre } = require("../models/genres")
const auth = require("../middleware/auth")
const isAdmin = require("../middleware/admin")

// Routes
router.get("/", async (request, response) => {
    return response.send(await Genre.find().sort({ name: 1 }))
})

router.get("/:id", async(request, response) => {
    const id = request.params.id

    if ( !mongoose.Schema.Types.ObjectId.isValid() ) return response.sendStatus(400)

    const genre = await Genre.findById(id)

    if ( genre ) return response.send( genre )
    return response.setStatus(404)
})

router.post("/", auth, async (request, response) => {
    const { error } = validate(request.body)
    if ( error ) return response.status(400).send(error.details[0].message)

    const exists = await Genre.find({name : request.body.name}).countDocuments() > 0
    
    if ( exists ) return response.status(400).send("Genre already exists")

    const genre = await new Genre(request.body).save()
    return response.send(genre)
})

router.put("/:id", auth, async (request, response) => {
    const id = request.params.id

    const { error } = validate(request.body)
    if ( error ) return response.status(400).send(error.details[0].message)   

    if (!mongoose.Schema.Types.ObjectId.isValid(id)) return response.sendStatus(404) 

    const genre = await genre.findById(id)

    if(!genre) return response.sendStatus(404)

    await genre.set(request.body).save()

    return response.send(genre)
})

router.delete("/:id", auth, isAdmin, async (request, response) => {
    const id = request.params.id

    genre = await Genre.findByIdAndDelete(id)

    if(genre) return response.send(genre)

    return response.sendStatus(404)
})


module.exports = router