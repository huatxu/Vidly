const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const { Rental, validate } = require("../models/rental")
const { Customer } = require("../models/customer")
const { Movie } = require ("../models/movie")
const Fawn = require("fawn")
const auth = require("../middleware/auth")
const asyncMiddleware = require("../middleware/async")

Fawn.init(mongoose)

router.get("/", asyncMiddleware(async (request, response) => {
    return response.send(await Rental.find().sort({ date: 1 }))
}))

router.post("/", auth, asyncMiddleware(async (request, response) => {    
    const { error } = validate(request.body)
    if (error) return response.status(400).send(error.details[0].message)
    
    const customer = await Customer.findById(request.body.customerID)
    if(!customer) return response.status(400).send("Customer ID not valid")
    
    const movie = await Movie.findById(request.body.movieID)
    if(!movie) return response.status(400).send("Movie ID not valid")
    
    const rental = await new Rental({
        movie: {
            _id: movie._id,
            title: movie.title
        },
        customer: {
            _id: customer._id,
            name: customer.name
        }
    })
        
    new Fawn.Task()
        .save("rentals", rental)
        .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
        .run()
    
    return response.send(rental)
}))

module.exports = router