// src/components/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <div style={listStyle}>
        <ul>
          <li>Axel Iparrea</li>
          <li>Rafael Rivas</li>
          <li>Eduardo Tello</li>
        </ul>
      </div>

      <div style={dividerStyle}></div>

      <div style={contentStyle}>
        <div style={leftColumn}>
          <h3>Pokemons</h3>
          <p>
            En esta sección, aprenderás sobre Pokemons. ¡Haz clic para explorar
            más!
          </p>
          <button onClick={() => navigate("/pokemons")} style={buttonStyle}>
            Ir a Pokemons
          </button>
        </div>

        <div style={rightColumn}>
          <h3>Clima</h3>
          <p>
            En esta sección, encontrarás información sobre el clima y sus
            cambios.
          </p>
          <button onClick={() => navigate("/climate")} style={buttonStyle}>
            Ir a Clima
          </button>
        </div>
      </div>
    </div>
  );
}

const listStyle = {
  textAlign: "center",
  marginTop: "20px",
};

const dividerStyle = {
  margin: "40px 0",
  borderBottom: "2px solid #ccc",
  width: "80%",
  marginLeft: "auto",
  marginRight: "auto",
};

const contentStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0 20px",
};

const leftColumn = {
  width: "45%",
  textAlign: "center",
};

const rightColumn = {
  width: "45%",
  textAlign: "center",
};

const buttonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export default Home;
