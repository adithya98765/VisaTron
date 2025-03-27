import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Visamfstyl.css';
import logo from './img/visa1.png';
import tag from './img/taggies.png';

//Fetching Countries 

let countries=[];

async function fetchCountryNames() {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const countries1 = await response.json();
  const countries = countries1.map(country => country.name.common);
  return countries;
}

(async () => {
  countries = await fetchCountryNames();
})();




function Visamf() {

//Autocomplete

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError]= useState('')
  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSuggestions(
      value ? countries.filter(country => country.toLowerCase().startsWith(value.toLowerCase())) : []
    );
  };

  const handleSuggestionClick = (country) => {
    setQuery(country);
    setSuggestions([]); 
    setError('')
  };

  const handleFlyClick = () => {
    if(query){
      navigate(`/fly?country=${query}`);
    }
    else{
      setError('Please select a country before proceeding');
    }
  }

  // Function to clear the error message on container click
  const handleContainerClick = () => {
    setError('');
  }

  



  return (
    <visamf1 className="App-header">

  <p class="p1">Hello there!</p>
  <p class="p2">Where's your next international adventure taking you?</p><br></br>

  <div className="container mt-5" style={{ position: 'absolute' , top: '220px', left: '60px'}} onClick={handleContainerClick}>
        <form className="form-group">
          <label className="country-label" htmlFor="country"></label>
          <input
            type="text"
            id="country"
            name="country"
            className="form-control country-input"
            value={query}
            onChange={handleInputChange}
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="list-group mt-2 autocomplete-suggestions">
              {suggestions.map((country, index) => (
                <li
                  key={index}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSuggestionClick(country)}
                >
                  {country}
                </li>
              ))}
            </ul>
          )}
        </form>

        {error && <p style={{ color: 'red', position: 'absolute', top: '32px', left: '25px'}}>{error}</p>}  {/* Error message moved inside the container */}
  </div>


  <img src={logo} className="imgstyl"/><br/>
  <button class="fly" onClick={handleFlyClick}>
  <span class="circle" aria-hidden="true">
  <span class="icon arrow"></span>
  </span>
  <span class="button-text">Fly me there</span>
</button><br></br>

<img src={tag} className='tagstyl'/>

      
</visamf1>
  );
}

export default Visamf;
