// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Pokemons from "./components/Pokemons";
import Clima from "./components/Clima";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemons" element={<Pokemons />} />
          <Route path="/climate" element={<Clima />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
