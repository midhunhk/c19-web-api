/**
 * Entry point and the express server for the c19 web api
 */

const service = require('./service')
const express = require('express');
const app     = express();

const PORT = process.env.PORT || '3000'
const VERSION = process.env.npm_package_version //"0.3.1"

app.get('/marco', (req, res) => res.send("polo") )

app.get('/summary/country/:countryCode', (req, res) => {
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

app.get('/summary/state/:stateCode', (req, res) => {
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