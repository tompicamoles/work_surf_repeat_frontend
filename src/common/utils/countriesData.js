import countries from "./countries.json"

  
  export function getCountryCode(countryName) {
    return countries[countryName].code || "Country code not found";
  }

  export function getCountryContinent(countryName) {
    return countries[countryName].continent || "Continent not found"
  }

  export function getCountryGoodWeatherSeason(countryName) {
    return countries[countryName].goodWeatherSeason || "good weather season not found"
  }

  export function getCountrySurfSeason(countryName) {
    return countries[countryName].surfSeason || "good weather season not found"
  }
  
  export function getCountryLifecost(countryName) {
    
    return countries[countryName].lifeCost || "lifecost not found"
  }

  export function getCountriesList() {
    const countriesList = Object.keys(countries).sort()
    
    return countriesList || "country not found"
    
  }