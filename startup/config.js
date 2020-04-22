const config = require("config")
module.exports = function () {
    if(!config.get("jwt-private-key"))
        throw new Error("jwt-private-key not defined")
}