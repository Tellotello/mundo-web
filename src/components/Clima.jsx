// src/components/Climate.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

function Climate() {
  const [weatherData, setWeatherData] = useState(null);
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [error, setError] = useState(null);

  const fetchWeatherData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=8ed010cd47ea9b6f6606389634daaa98`
      );
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching weather data", error);
      setError("Error en obntencion clima");
    }
  }, [lat, lon]);

  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        },
        (error) => {
          console.error("Error obteniendo la ubicación", error);
          setError("No se pudo obtener la ubicación.");
        }
      );
    } else {
      setError("No soportada");
    }
  };

  useEffect(() => {
    if (lat && lon) {
      fetchWeatherData();
    }
  }, [lat, lon, fetchWeatherData]);

  return (
    <div style={containerStyle}>
      <h1>Página de Clima</h1>
      <input
        type="text"
        placeholder="Latitud"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Longitud"
        value={lon}
        onChange={(e) => setLon(e.target.value)}
        style={inputStyle}
      />
      <div style={buttonContainerStyle}>
        <button onClick={fetchWeatherData} style={buttonStyle}>
          Obtener Clima
        </button>
      </div>
      <div style={buttonContainerStyle}>
        <button onClick={getGeolocation} style={buttonStyle}>
          Ubicación actual
        </button>
      </div>

      {error && <p style={errorStyle}>{error}</p>}

      {weatherData && (
        <div style={weatherStyle}>
          <h2>Clima Actual</h2>
          <p>Temperatura: {weatherData.main.temp} °C</p>
          <p>Descripción: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  textAlign: "center",
  marginTop: "50px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const inputStyle = {
  padding: "10px",
  margin: "10px",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "10px",
  fontSize: "16px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const buttonContainerStyle = {
  marginBottom: "20px",
};

const errorStyle = {
  color: "red",
  marginTop: "10px",
};

const weatherStyle = {
  marginTop: "20px",
  textAlign: "center",
};

export default Climate;
