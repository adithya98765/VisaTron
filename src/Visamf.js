import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Visamfstyl.css';
import logo from './img/visa1.png';
import tag from './img/taggies.png';

function Visamf() {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountryNames = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCountries(data.map(country => country.name.common));
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError('Failed to load countries.');
      }
    };
    fetchCountryNames();
  }, []);

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
    setError('');
  };

  const handleFlyClick = () => {
    if (query) navigate(`/fly?country=${query}`);
    else setError('Please select a country before proceeding');
  };

  const handleContainerClick = () => setError('');

  return (
    <div className="App-header">
      <p className="p1">Hello there!</p>
      <p className="p2">Where's your next international adventure taking you?</p><br />

      <div
        className="container mt-5"
        style={{ position: 'absolute', top: '220px', left: '60px' }}
        onClick={handleContainerClick}
      >
        <form className="form-group">
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
        {error && (
          <p style={{ color: 'red', position: 'absolute', top: '32px', left: '25px' }}>
            {error}
          </p>
        )}
      </div>

      <img src={logo} className="imgstyl" alt="Visa Logo" /><br />
      
      <button className="fly" onClick={handleFlyClick}>
        <span className="circle" aria-hidden="true">
          <span className="icon arrow"></span>
        </span>
        <span className="button-text">Fly me there</span>
      </button><br />

      <img src={tag} className="tagstyl" alt="Tags" />
    </div>
  );
}

export default Visamf;