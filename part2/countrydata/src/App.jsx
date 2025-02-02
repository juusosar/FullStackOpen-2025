import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'
import SearchBar from './components/SearchBar'
import Countries from './components/Countries'
import CountryData from './components/CountryData'

function App() {
  const [countries, setCountries] = useState([])
  const [currentFilter, setCurrentFilter] = useState('')
  const [countryData, setCountryData] = useState(null)
  const [showCountry, setShowCountry] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weatherData, setWeatherData] = useState(null)

  const countryFilter = countries.filter(country => country.toLowerCase().includes(currentFilter.toLowerCase()))

  useEffect(() => {
    countryService
        .getAll()
        .then(allCountries => setCountries(allCountries.map(country => (country.name.common))))
  }, [])

  useEffect(() => {
    if (showCountry) {
      countryService
          .getCountry(selectedCountry)
          .then(receivedCountryData => {
            setCountryData(receivedCountryData)
            fetchWeatherData(receivedCountryData)
          })
    } else {
      resetData()
    }
  }, [showCountry, selectedCountry])

  useEffect(() => {
    if (countryFilter.length === 1) {
      setSelectedCountry(countryFilter[0])
      setShowCountry(true)
    }
    if (countryFilter.length === 0) setShowCountry(false)
    if (countryFilter.length > 10) setShowCountry(false)
  }, [countryFilter])


  const handleFilterChange = (event) => {
    setCurrentFilter(event.target.value)
    if (currentFilter.length === 0) setShowCountry(false)
  }

  const selectCountry = (event) => {
    setSelectedCountry(event.target.value)
    setShowCountry(true)
  }

  const fetchWeatherData = (receivedCountryData) => {
    weatherService
        .getWeatherData(receivedCountryData.capitalInfo.latlng)
        .then(receivedWeatherData => {
          setWeatherData(receivedWeatherData)
        })
  }

  const resetData = () => {
    setCountryData(null)
    setSelectedCountry(null)
    setWeatherData(null)
  }


  return (
    <>
      <SearchBar value={currentFilter} onChange={handleFilterChange} />
      <div>
        <Countries filter={countryFilter} state={currentFilter} onClick={selectCountry} />
      </div>
      <CountryData data={countryData} show={showCountry} weatherData={weatherData}/>
    </>
  )
}

export default App
