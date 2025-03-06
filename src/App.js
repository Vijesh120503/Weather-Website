import { useState } from "react";
import axios from "axios";
import "./App.css";



const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const UNSPLASH_URL = "https://api.unsplash.com/search/photos";


function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bgImage, setBgImage] = useState("");

  const fetchWeather = async () => {
    if (!city) {
      alert("Please enter a city name");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(WEATHER_API_URL, {
        params: { q: city, appid: WEATHER_API_KEY, units: "metric" },
      });
      setWeather(response.data);
      fetchCityImage(city);
    } catch (err) {
      setError("City not found! Try again.");
      setBgImage(""); 
    } finally {
      setLoading(false);
    }
  };

  const fetchCityImage = async (cityName) => {
    try {
      const response = await axios.get(UNPLASH_URL, {
        params: { query: cityName, client_id: UNSPLASH_ACCESS_KEY, orientation: "landscape", per_page: 1 },
      });

      if (response.data.results.length > 0) {
        setBgImage(response.data.results[0].urls.full);
      } else {
        setBgImage(""); 
      }
    } catch {
      setBgImage(""); 
    }
  };

  return (
    <div className="container" style={{ backgroundImage: bgImage ? `url(${bgImage})` : "" }}>
      <div className="weather-box">
        <h2>Weather App</h2>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>{loading ? "Loading..." : "Get Weather"}</button>

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="weather-details">
            <h3>{weather.name}, {weather.sys.country}</h3>
            <p>🌡️ {weather.main.temp}°C</p>
            <p>☁️ {weather.weather[0].description}</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>🌬️ Wind: {weather.wind.speed} m/s</p>
            <p>🌅 Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
            <p>🌇 Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
