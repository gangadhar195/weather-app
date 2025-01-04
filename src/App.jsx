import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);
  const [background, setBackground] = useState("default");

  const API_KEY = ""; // Replace with your OpenWeatherMap API Key

  const weatherIcons = {
    Thunderstorm: "wi-thunderstorm",
    Drizzle: "wi-sprinkle",
    Rain: "wi-rain",
    Snow: "wi-snow",
    Clear: "wi-day-sunny",
    Clouds: "wi-cloudy",
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  const fetchWeatherData = async () => {
    try {
      setError(false); // Reset error state
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);

      const condition = response.data.weather[0].main;
      if (condition === "Clear") setBackground("sunny");
      else if (condition === "Clouds") setBackground("cloudy");
      else if (condition === "Rain" || condition === "Drizzle")
        setBackground("rainy");
      else if (condition === "Snow") setBackground("snowy");
      else setBackground("default");
    } catch (error) {
      setError(true);
      setWeatherData(null);
      console.error("City not found:", error);
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const getWeatherIcon = (condition) =>
    weatherIcons[condition] || "wi-na";

  return (
    <div className={`app ${background}`}>
      <div className="container">
        <input
          type="text"
          className="search-bar"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter city name"
        />
        {error ? (
          <div className="error-message">
            <h2>City not found or data cannot be fetched  Please try again!.</h2>
          </div>
        ) : weatherData ? (
          <div className="weather-info">
            <h1>{weatherData.name}</h1>
            <i
              className={`wi ${getWeatherIcon(
                weatherData.weather[0].main
              )} weather-icon`}
            ></i>
            <h2>{Math.round(weatherData.main.temp)}°C</h2>
            <h3>{weatherData.weather[0].description}</h3>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default App;
