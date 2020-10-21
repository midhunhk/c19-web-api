const simpleLogger = (req, res, next) => {
    console.log(`Request ${req.method}:${req.url} ${res.statusCode}`)
    next()
}

module.exports = simpleLogger