const express = require("express")
const router = express.Router()
const { Login, validate } = require("../models/login")
const { User } = require("../models/user")
const bcrypt = require("bcrypt")

router.post("/", async (request, response) => {
    const { error } = validate(request.body)
    if ( error ) return response.status(400).send(error.details[0].message)

    const user = await User.findOne({email : request.body.email})
    if ( !user ) return response.status(400).send("The email or password are incorrect")

    const isValidLogin = await bcrypt.compare(request.body.password, user.password)
    const token =  user.generateAuthToken()

    if(isValidLogin) return response.send(token)

    return response.status(400).send("The email or password are incorrect")
})

module.exports = router