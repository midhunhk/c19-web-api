/**
 * The service layer that connects with the backend webservice
 */
const axios = require('axios')

const SUMMARY_API_URL = 'https://api.covid19api.com/summary'
const STATES_DATA_URL = 'https://api.covid19india.org/v4/min/data.min.json'
const STATES_DATA_2_URL = 'https://api.covid19india.org/states_daily.json'

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
            .then( response => {
                const filteredByStateCode = filterByStateCode(response.data, stateCode)

                if(!filterByCountryCode.deltaAvailable) {
                    console.log("State Delta not available, invoking states_daily.json")
                    const deltaPromise = axios.get(STATES_DATA_2_URL)
                    deltaPromise
                        .then( response =>{
                            // Parse the response to find the latest delta with this stateCode
                            const stateDelta = getStateDelta(response.data, stateCode)

                            filteredByStateCode.deltaAvailable = true
                            filteredByStateCode.confirmedToday = stateDelta.confirmed
                            filteredByStateCode.deceasedToday = stateDelta.deceased
                            filteredByStateCode.recoveredToday = stateDelta.recovered
                            // This response does not contain test count
                            filteredByStateCode.testedToday = 0

                            resolve(filteredByStateCode)
                        })
                        .catch( error => reject(error))
                } else {
                    resolve(filteredByStateCode)
                }
            } )
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

    // console.log(statesData)
    // Extract the required data at a single level
    const result = { 
        stateCode: dataIndex,
        updatedAt: statesData.meta.last_updated,
        population: statesData.meta.population,
        deltaAvailable: false,
        confirmedTotal: statesData.total.confirmed,
        deceasedTotal: statesData.total.deceased,
        recoveredTotal: statesData.total.recovered,
        testedTotal: statesData.total.tested
    }

    if(statesData.delta){
        result.deltaAvailable = true,
        result.confirmedToday = statesData.delta.confirmed
        result.deceasedToday = statesData.delta.deceased
        result.recoveredToday = statesData.delta.recovered
        result.testedToday = statesData.delta.tested
    }

    return result
}

function getStateDelta(data, stateCode){
    const stateKey = stateCode.toLowerCase()
    const result = {
        stateCode: stateKey
    }
    
    const tail = data.states_daily.reverse().slice( 0, 3)
    //console.log( tail )

    tail.forEach(element => {
        switch(element.status) {
            case 'Deceased':
                result.deceased = element[stateKey]
                break;
            case 'Recovered':
                result.recovered = element[stateKey]
                break;
            case 'Confirmed':
                result.confirmed = element[stateKey]
                break;
        }
    });

    return result
}

module.exports = {
    getSummaryByCountry : getSummaryByCountry,
    getSummaryByState: getSummaryByState
}