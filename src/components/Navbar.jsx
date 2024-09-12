// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={navbarStyle}>
      <ul style={navListStyle}>
        <li style={navItemStyle}>
          <Link to="/" style={linkStyle}>
            Inicio
          </Link>
        </li>
        <li style={navItemStyle}>
          <Link to="/pokemons" style={linkStyle}>
            Pokemons
          </Link>
        </li>
        <li style={navItemStyle}>
          <Link to="/climate" style={linkStyle}>
            Clima
          </Link>
        </li>
      </ul>
    </nav>
  );
}

// Inline styling for navbar
const navbarStyle = {
  backgroundColor: "#282c34",
  padding: "10px",
};

const navListStyle = {
  listStyle: "none",
  display: "flex",
  justifyContent: "center",
  margin: "0",
  padding: "0",
};

const navItemStyle = {
  margin: "0 15px",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
};

export default Navbar;
