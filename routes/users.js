const express = require("express")
const router = express.Router()
const { validate, User } = require("../models/user")
const _ = require("lodash")
const bcrypt = require("bcrypt")
const auth = require("../middleware/auth")
const asyncMiddleware = require("../middleware/async")

router.get("/me", auth, asyncMiddleware(async (request, response) => {
    response.send(await User.findById(request.user._id).select("-password"))
}))

router.post("/", asyncMiddleware(async (request, response) => {
    const { error } = validate(request.body)
    if ( error ) return response.status(400).send(error.details[0].message)

    if ( await User.find({ email: request.body.email }).countDocuments() > 0 ) return response.status(400).send("User already exists")
    
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(request.body.password, salt)
    
    let user = new User(_.pick(request.body, ["name", "email", "password"]))
    
    user.password = hashed
    await user.save()

    
    response.header("x-vidly-tok", user.generateAuthToken())
    user = _.pick(user, ["_id", "email", "name"])

    if( user ) return response.send(user)
}))

module.exports = router