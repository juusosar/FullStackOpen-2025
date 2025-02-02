import axios from "axios"
const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY
const baseUrl = "https://api.openweathermap.org/"
const dataUrl = `${baseUrl}data/2.5/weather`

const getWeatherData = (latlng) => {
    return axios
        .get(`${dataUrl}?lat=${latlng[0]}&lon=${latlng[1]}&units=metric&appid=${api_key}`)
        .then(response => response.data)
        .catch(error => console.log(error))
}

export default { getWeatherData }