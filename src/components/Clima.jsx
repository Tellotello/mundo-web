// src/components/Climate.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styles from './Climate.module.css';

function Climate() {
  const [weatherData, setWeatherData] = useState([]);
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lon: null });

  const fetchWeatherDataByCoords = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=8ed010cd47ea9b6f6606389634daaa98`
      );
      const newWeather = {
        id: Date.now(),
        location: `Lat: ${lat}, Lon: ${lon}`,
        temperature: response.data.main.temp,
        description: response.data.weather[0].description,
        lat: lat,
        lon: lon,
      };
      setWeatherData((prevData) => [...prevData, newWeather]);
      setError(null);
    } catch (error) {
      setError("Error al obtener el clima por coordenadas");
    }
  }, [lat, lon]);

  const fetchWeatherDataByCity = async () => {
    try {
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=8ed010cd47ea9b6f6606389634daaa98`
      );
      const cityLat = geoResponse.data.coord.lat;
      const cityLon = geoResponse.data.coord.lon;

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&units=metric&appid=8ed010cd47ea9b6f6606389634daaa98`
      );
      const newWeather = {
        id: Date.now(),
        location: city,
        temperature: response.data.main.temp,
        description: response.data.weather[0].description,
        lat: cityLat,
        lon: cityLon,
      };

      setWeatherData((prevData) => [...prevData, newWeather]);
      setError(null);
    } catch (error) {
      setError("Error al obtener el clima por ciudad");
    }
  };

  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
          setCurrentLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
        (error) => {
          setError("No se pudo obtener la ubicación.");
        }
      );
    } else {
      setError("No soportada");
    }
  };

  const handleDelete = (id) => {
    setWeatherData((prevData) => prevData.filter((data) => data.id !== id));
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  useEffect(() => {
    if (lat && lon) {
      fetchWeatherDataByCoords();
    }
  }, [lat, lon, fetchWeatherDataByCoords]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Página de Clima</h2>

      <input
        type="text"
        placeholder="Buscar ciudad"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className={styles.input}
      />
      <div className={styles.buttonContainer}>
        <button onClick={fetchWeatherDataByCity} className={styles.button}>
          Buscar por Ciudad
        </button>
        <button onClick={getGeolocation} className={styles.button}>
          Obtener Ubicación Actual
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.weatherList}>
        {weatherData.map((weather) => (
          <div key={weather.id} className={styles.weather}>
            <h2>{weather.location}</h2>
            <p>Temperatura: {weather.temperature} °C</p>
            <p>Descripción: {weather.description}</p>
            {currentLocation.lat && currentLocation.lon && (
              <p>
                Distancia desde tu ubicación: {calculateDistance(currentLocation.lat, currentLocation.lon, weather.lat, weather.lon).toFixed(2)} km
              </p>
            )}
            <button onClick={() => handleDelete(weather.id)} className={styles.deleteButton}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Climate;
