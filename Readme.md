# C19 Web API
A basic web api to get C19 status.  
The data is sourced from the below sources.

https://api.covid19api.com/  
https://www.covid19india.org/  

## Development mode
npm run dev

## Endpoints
/summary/country/:countryCode  
/summary/state/:stateCode  
/about  
/marco  

## Notes
Since the API's are rate limited, the service responses for the summary endpoints are cached to prevent overrunning the rate