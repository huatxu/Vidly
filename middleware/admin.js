const jwt = require("jsonwebtoken")
const config = require("config")

function isAdmin(request, response, next) {
    const token = request.header("x-vidly-tok");
    if (!token) return response.status(401).send("Missing token")

    const isValid = jwt.verify(token, config.get("jwt-private-key"))
    const decoded = jwt.decode(token)
    if(isValid && decoded.isAdmin) return next()
    
    return response.status(403).send("Forbidden")

}

module.exports = isAdmin