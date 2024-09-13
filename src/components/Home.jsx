// src/components/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <div style={contentStyle}>
        <div style={leftColumnImage}>
          <div style={leftColumn}>
            <h1>Pokemons</h1>
            <p style={text}>
              En esta sección, aprenderás sobre Pokemons. ¡Haz clic para
              explorar más!
            </p>
            <img
              style={pokeball}
              alt="pokeball"
              src="https://www.pngplay.com/wp-content/uploads/2/Pokeball-PNG-Photo-Image.png"
            ></img>
            <button onClick={() => navigate("/pokemons")} style={buttonStyle}>
              Ir a Pokemons
            </button>
          </div>
        </div>

        <div style={rightColumnImage}>
          <div style={rightColumn}>
            <h1>Clima</h1>
            <p style={text}>
              En esta sección, encontrarás información sobre el clima y sus
              cambios.
            </p>
            <img
              style={clima}
              alt="clima"
              src="https://cdn-icons-png.flaticon.com/512/2640/2640490.png"
            ></img>
            <button onClick={() => navigate("/climate")} style={buttonStyle}>
              Ir a Clima
            </button>
          </div>
        </div>
      </div>

      {/* <div style={dividerStyle}></div>
      <div style={listStyle}>
        <ul style={names}>
          <li>Axel Iparrea</li>
          <li>Rafael Rivas</li>
          <li>Eduardo Tello</li>
        </ul>
      </div> */}
    </div>
  );
}

const text = {
  fontFamily: `system-ui, sans-serif`,
  fontSize: `2rem`,
  color: `white`,
  margin: `20px`,
};

// eslint-disable-next-line
const contentStyle = {
  display: "flex",
  justifyContent: "space-between",
  background: `#525252`,
  // eslint-disable-next-line
  background: `-webkit-linear-gradient(to right, #525252, #3d72b4)`,
  // eslint-disable-next-line
  background: `linear-gradient(to right, #525252, #3d72b4)`,
  height: "96vh",
};

const pokeball = {
  width: "20rem",
  alignSelf: "center",
};
const clima = {
  width: "20rem",
  alignSelf: "center",
};

const leftColumnImage = {
  backgroundSize: "cover",
  backgroundImage: `url("https://wallpapercave.com/wp/wp5317305.png")`,
  width: "50%",
  height: "55rem",
  margin: "20px",
  borderRadius: "40px",
  overflow: "hidden",
  padding: "2px",
};

const leftColumn = {
  display: "flex",
  flexFlow: "column",
  alignItems: "center",
  textAlign: "center",
  height: "60rem",
  borderRadius: "40px",
  backdropFilter: "blur(2px)",
};

const rightColumnImage = {
  backgroundSize: "cover",
  backgroundImage: `url("https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max")`,
  width: "50%",
  height: "55rem",
  margin: "20px",
  borderRadius: "40px",
  overflow: "hidden",
  padding: "2px",
};

const rightColumn = {
  display: "flex",
  flexFlow: "column",
  alignItems: "center",
  textAlign: "center",
  height: "60rem",
  borderRadius: "40px",
  backdropFilter: "blur(2px)",
};

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  fontSize: `1.4rem`,
};

export default Home;
