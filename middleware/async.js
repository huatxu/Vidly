module.exports = function(handler) {
    return async (request, response, next) => {
        try {
            await handler()
        } catch ( err ) {
            next(err);
        }
    }

}