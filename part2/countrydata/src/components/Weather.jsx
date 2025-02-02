const Weather = ({ capital, data}) => {
    if (data == null) return

    const iconUrl = `https://openweathermap.org/img/wn`
    const imgUrl = `${iconUrl}/${data.weather[0].icon}@2x.png`

    return (
        <>
            <h2>Weather in {capital}</h2>
            <div>temperature {data.main.temp} Celsius</div>
            <img src={imgUrl} alt={data.weather.description}/>
            <div>wind {data.wind.speed} m/s</div>
        </>
    )

}

export default Weather