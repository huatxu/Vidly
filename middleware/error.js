const winston = require("winston");
module.exports = function (exception, request, response, next) {
    winston.log("error", exception.message, exception)
    response.sendStatus(500)
}