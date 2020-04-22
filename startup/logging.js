const winston = require("winston")
require("winston-mongodb")

module.exports = function () {
    winston.add(new winston.transports.Console())
    winston.add(new winston.transports.File({ filename : "logs.txt" }))
    winston.add(new winston.transports.MongoDB({db: "mongodb://localhost/vidly" }))

    process.on("uncaughtException", function (err) {
        winston.error(err.message, err)
        process.exit(1)
    })
    process.on("unhandledRejection", function (err) {
        winston.error(err.message, err)
        process.exit(1)
    })  
}