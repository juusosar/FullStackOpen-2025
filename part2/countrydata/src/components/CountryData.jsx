import Weather from "./Weather"

const CountryData = ({ data, show, weatherData, img}) => {
    if (!data) return
    if (!show) return

    return (
        <>
            <div>
                <h1>{data.name.common}</h1>
                <div>capital {data.capital.valueOf()}</div>
                <div>area {data.area}</div>
            </div>

            <div>
                <h3>languages:</h3>
                <ul>
                    {Object.values(data.languages).map(
                        (language, index) => (
                        <li key={index}>
                            {language}
                        </li>
                        )
                    )}
                </ul>
            </div>

            <div>
                <img src={data.flags.png} alt={data.flags.alt}/>
            </div>

            <div>
                <Weather capital={data.capital.valueOf()} data={weatherData} img={img}/>
            </div>
        </>
    )
}

export default CountryData