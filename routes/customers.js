const Joi = require("joi")
const mongoose = require("mongoose")
const express = require("express")
const auth = require("../middleware/auth")
const router = express.Router()
const { Customer, validate } = require("../models/customer")
const isAdmin = require("../middleware/admin")

// Routes

router.get("/", async (request, response) => {
    response.send(await Customer.find().sort({ name : 1 }))
})

router.get("/:id", async (request, response) => {
    const id = request.params.id

    if( !mongoose.Schema.Types.ObjectId.isValid(id) ) return response.sendStatus(404)
        
    const customer = await Customer.findById(id)
        
    if(customer) return response.send(customer)
    
    return response.status(404).send("Customer not found")
})

router.post("/", auth, async (request, response) => {    
    const { error } = validate(request.body)
    if ( error ) return response.status(400).send(error.details[0].message)
    
    return response.send(await new Customer(request.body).save())
})

router.put("/:id", auth, async (request, response) => {
    const id = request.params.id
    if( !mongoose.Schema.Types.ObjectId.isValid(id) ) return response.sendStatus(404)
        
    const { error } = validate(request.body)
    if ( error ) return response.status(400).send(error.details[0].message)

    const customer = await Customer.findById(id)
    if(customer) return response.send(await customer.set(request.body).save())
        
    return response.status(404).send("Customer not found")
})

router.delete("/:id", auth, isAdmin, async (request, response) => {
    const id = request.params.id
    
    if( !mongoose.Schema.Types.ObjectId.isValid(id) ) return response.sendStatus(404)
        
    const customer = await Customer.findByIdAndDelete(request.params.id)
    if(customer) return response.send(customer)

    return response.status(404).send("Customer not found")
})

module.exports = router