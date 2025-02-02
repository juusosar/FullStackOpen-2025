const Countries = ({ filter, state, onClick }) => {
    if (!state) return
    if (filter.length === 1) return
    if (filter.length > 10) return <div>Too many matches, specify another filter</div>

    return (
        <div>
            {filter.map((country, index) =>
                <div key={index}>
                    {country}
                    <button value={country} onClick={onClick}>show</button>
                </div>
            )}
        </div>
    )
}

export default Countries