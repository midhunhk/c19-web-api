/**
 * The service layer that connects with the backend webservice
 */
const axios = require('axios')

const SUMMARY_API_URL = 'https://api.covid19api.com/summary'
const STATES_DATA_URL = 'https://api.covid19india.org/v4/min/data.min.json'

function getSummaryByCountry(countryCode){
    console.log("getSummaryByCountry() ")
    return new Promise( function(resolve, reject){
        const servicePromise = axios.get(SUMMARY_API_URL)
        servicePromise
            .then( response => resolve( filterByCountryCode(response.data, countryCode) ) )
            .catch( error => reject(error))
    })
}

function getSummaryByState(stateCode) {
    console.log("getSummaryByState() ")
    return new Promise( function(resolve, reject){
        const servicePromise = axios.get(STATES_DATA_URL)
        servicePromise
            .then( response => resolve( filterByStateCode(response.data, stateCode) ) )
            .catch( error => reject(error))
    })
}

function filterByCountryCode(data, countryCode) {
    console.log("filterByCountryCode()")
    const codeToMatch = countryCode.toUpperCase()
    // Find the Countries node
    const countriesData = data.Countries
    // Filter by countryCode
    const filtered = countriesData.filter( item => {
        return item.CountryCode === codeToMatch
    })
    // console.log(filtered)
    return {
        countryName: filtered[0].Country,
        countryCode : codeToMatch,
        updatedAt: filtered[0].Date,
        confirmedToday: filtered[0].NewConfirmed,
        deceasedToday: filtered[0].NewDeaths,
        recoveredToday: filtered[0].NewRecovered,
        confirmedTotal: filtered[0].TotalConfirmed,
        deceasedTotal: filtered[0].TotalDeaths,
        recoveredTotal: filtered[0].TotalRecovered
    }
}

function filterByStateCode(data, stateCode){
    console.log("filterByStateCode()")
    const dataIndex = stateCode.toUpperCase()
    const statesData = data[dataIndex]

    // Extract the required data at a single level
    return { 
        stateCode: dataIndex,
        updatedAt: statesData.meta.last_updated,
        population: statesData.meta.population,
        confirmedToday: statesData.delta.confirmed,
        deceasedToday: statesData.delta.deceased,
        recoveredToday: statesData.delta.recovered,
        testedToday: statesData.delta.tested,
        confirmedTotal: statesData.total.confirmed,
        deceasedTotal: statesData.total.deceased,
        recoveredTotal: statesData.total.recovered,
        testedTotal: statesData.total.tested
    }
}

module.exports = {
    getSummaryByCountry : getSummaryByCountry,
    getSummaryByState: getSummaryByState
}