// Requires
const express = require("express")
const mongoose = require("mongoose")
const winston = require("winston")


const app = express()
const port = process.env.PORT || 3000

require("./startup/logging")()
require("./startup/api")()
require("./startup/routes")(app)
require("./startup/db")()
require("./startup/config")()

// Templates
app.set("view engine", "pug")
app.set("views", "./views")


// Server
app.listen(port, () => winston.info(`Server listening on port ${port}`))