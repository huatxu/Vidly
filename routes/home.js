const express = require('express')
const router = express.Router()

router.get("/", (request, response) => {
    response.render("index", {title:"Welcome", message:"Welcome to the homepage"})
})

module.exports = router