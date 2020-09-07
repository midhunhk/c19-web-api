/**
 * 
 */

const service = require('./service')
const express = require('express');
const app     = express();

const PORT = process.env.PORT || '3000'
const VERSION = "0.2.0"

app.get('/', (req, res) => res.send("Hello Universe!") )

app.get('/summary/country/:countryCode', (req, res) => {
    service.getSummaryByCountry(req.params.countryCode)
        .then( result => {
            console.log(result)
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
            console.log(result)
            res.status(200).send(result)
        })
        .catch( err => {
            console.log(err)
            res.status(400).send(err)
        })
})

app.get('/about', (req, res) => {
    res.status(200)
        .send(` C19 Web API <br/>Version ${VERSION} <br/>Source: https://api.covid19api.com/ Free API <br/> The free API is rate limited`)
})

app.get('/api', (req, res) => {
    res.status(200)
        .send("/summary/country/:countryCode <br/>/summary/state/:stateCode <br/>/about <br/>/api")
})

app.listen(PORT, () => console.log(`Running on port ${PORT}`) )

exports = module.exports = app;