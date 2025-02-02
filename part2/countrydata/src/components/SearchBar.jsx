const SearchBar = ({ value, onChange }) => {
    return (
        <div>
            find countries &nbsp;
            <input value={value} onChange={onChange}/>
        </div>
    )
}

export default SearchBar