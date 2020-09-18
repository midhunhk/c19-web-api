/**
 * Entry point and the express server for the c19 web api
 */

const service = require('./service')
const express = require('express');
const cache = require('memory-cache')
const app     = express();

const PORT = process.env.PORT || '3000'
const VERSION = process.env.npm_package_version
// cache duration in seconds, read from Config vars via environment var or default
const CACHE_DURATION = process.env.CACHE_DURATION || (60 * 1) 

// Create the cache middleware
let memCache = new cache.Cache()
let cacheMiddleware = (duration) => {
    return (req, res, next) => {
        let key =  '__express__' + req.originalUrl || req.url
        let cacheContent = memCache.get(key);
        if(cacheContent) {
            res.send( cacheContent );
            return
        } else {
            res.sendResponse = res.send
            res.send = (body) => {
                memCache.put(key, body, duration*1000);
                res.sendResponse(body)
            }
            next()
        } 
    }
}

// App Routes
app.get('/marco', (req, res) => res.send("polo") )

app.get('/summary/country/:countryCode', cacheMiddleware(CACHE_DURATION), (req, res) => {
    service.getSummaryByCountry(req.params.countryCode)
        .then( result => {
            // console.log(result)
            res.status(200).send(result)
        })
        .catch( err => {
            console.log(err)
            res.status(400).send(err)
        })
})

app.get('/summary/state/:stateCode', cacheMiddleware(CACHE_DURATION), (req, res) => {
    service.getSummaryByState(req.params.stateCode)
        .then( result => {
            // console.log(result)
            res.status(200).send(result)
        })
        .catch( err => {
            console.log(err)
            res.status(400).send(err)
        })
})

app.get('/about', (req, res) => {
    res.status(200)
        .send(` <b>C19 Web API</b> <br/>Version ${VERSION} <br/>Source: https://api.covid19api.com/ Free API <br/> The free API is rate limited`)
})

app.get('/', (req, res) => {
    res.status(200)
        .send("/summary/country/:countryCode <br/>/summary/state/:stateCode <br/>/about <br/>/marco")
})

app.listen(PORT, () => console.log(`Running on port ${PORT}`) )

exports = module.exports = app;