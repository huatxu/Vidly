const jwt = require("jsonwebtoken")
const config = require("config")

function auth (request, response, next) {
    const token = request.header("x-vidly-tok");
    if (!token) return response.status(401).send("Missing token")
    try {
        const decoded = jwt.verify(token, config.get("jwt-private-key"))
        request.user = decoded
        next()
    } catch {
        response.status(400).send("Invalid token")
    }
}

module.exports = auth