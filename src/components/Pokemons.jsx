import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import pokeballImage from '../images/pokeball.jpg';
function Pokemons() {
  const [search, setSearch] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [team, setTeam] = useState([]);
  const [randomPokemon, setRandomPokemon] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // In your component
  const [generation, setGeneration] = useState(1);
  const [legendaryList, setLegendaryList] = useState([]); // List of legendary Pokemon species

  // Function to fetch Pokémon by generation and generate a random team
  const generateRandomTeamFromGeneration = async (gen) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/generation/${gen}`
      );
      const pokemons = response.data.pokemon_species;
      const randomPokemons = [];

      while (randomPokemons.length < 6) {
        const randomPokemon =
          pokemons[Math.floor(Math.random() * pokemons.length)];
        const pokemonData = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${randomPokemon.name}`
        );
        if (!randomPokemons.find((p) => p.id === pokemonData.data.id)) {
          randomPokemons.push(pokemonData.data);
        }
      }

      setTeam(
        randomPokemons.map((pokemon) => ({ ...pokemon, showShiny: false }))
      );
    } catch (error) {
      console.error("Error fetching generation Pokémon", error);
    }
  };

  // Add a dropdown for selecting the generation

  const openModal = (pokemon) => {
    setSelectedPokemon(pokemon);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    const fetchAllPokemonSpecies = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon-species?limit=1000"
        );
        setPokemonList(response.data.results);

        // Fetch details for all species to find legendaries
        const detailedPokemonList = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const speciesResponse = await axios.get(pokemon.url);
            return { ...speciesResponse.data, url: pokemon.url };
          })
        );

        // Filter for legendaries
        const legendaries = detailedPokemonList.filter(
          (pokemon) => pokemon.is_legendary
        );
        setLegendaryList(legendaries);
      } catch (error) {
        console.error("Error fetching Pokémon species", error);
      }
    };

    fetchAllPokemonSpecies();
  }, []);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=1000"
        );
        setPokemonList(response.data.results);
      } catch (error) {
        console.error("Error fetching Pokémon list", error);
      }
    };

    fetchPokemonList();
  }, []);

  useEffect(() => {
    if (search === "") {
      setFilteredResults([]);
      return;
    }

    const filtered = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(search.toLowerCase())
    );

    const fetchPokemonDetails = async () => {
      const detailedResults = await Promise.all(
        filtered.map(async (pokemon) => {
          const res = await axios.get(pokemon.url);
          return res.data;
        })
      );
      setFilteredResults(detailedResults);
    };

    fetchPokemonDetails();
  }, [search, pokemonList]);

  const addToTeam = (pokemon) => {
    if (team.length < 10 && !team.find((p) => p.id === pokemon.id)) {
      setTeam([...team, { ...pokemon, showShiny: false }]);
    } else {
      alert("Tu equipo solo puede tener 10 pokemones, y sin duplicados!");
    }
  };

  // Function to generate a legendary team
  const generateLegendaryTeam = async () => {
    const randomLegendaries = [];
    try {
      while (randomLegendaries.length < 6) {
        const randomPokemon =
          legendaryList[Math.floor(Math.random() * legendaryList.length)];
        const pokemonData = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${randomPokemon.name}`
        );
        randomLegendaries.push(pokemonData.data);
      }

      setTeam(
        randomLegendaries.map((pokemon) => ({ ...pokemon, showShiny: false }))
      );
    } catch (error) {
      console.error("Error fetching legendary Pokémon", error);
    }
  };

  const removeFromTeam = (id) => {
    setTeam(team.filter((pokemon) => pokemon.id !== id));
  };

  const toggleShiny = (id, e) => {
    e.stopPropagation();
    setTeam(
      team.map((pokemon) =>
        pokemon.id === id
          ? { ...pokemon, showShiny: !pokemon.showShiny }
          : pokemon
      )
    );
  };

  const fetchRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${randomId}`
    );
    setRandomPokemon(response.data);
  };

  const calculateStats = () => {
    const totalWeight = team.reduce((acc, pokemon) => acc + pokemon.weight, 0);
    const totalHeight = team.reduce((acc, pokemon) => acc + pokemon.height, 0);
    const averageHeight = team.length ? totalHeight / team.length : 0;
    const types = [
      ...new Set(
        team.flatMap((pokemon) =>
          pokemon.types.map((typeInfo) => typeInfo.type.name)
        )
      ),
    ];

    return {
      totalWeight,
      averageHeight,
      types,
    };
  };

  const stats = calculateStats();

  return (
    <div style={containerStyle}>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Pokémon Details"
        style={modalStyle}
      >
        {selectedPokemon && (
          <div>
            <h2>{selectedPokemon.name}</h2>
            <img
              src={selectedPokemon.sprites.front_shiny}
              alt={`${selectedPokemon.name} Shiny`}
            />
            <p>Weight: {selectedPokemon.weight}</p>
            <p>Height: {selectedPokemon.height}</p>
            <p>
              Abilities:{" "}
              {selectedPokemon.abilities
                .map((ability) => ability.ability.name)
                .join(", ")}
            </p>
            <p>
              Types:{" "}
              {selectedPokemon.types
                .map((typeInfo) => typeInfo.type.name)
                .join(", ")}
            </p>
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
      <div>
        <h3>Selecciona una generación</h3>
        <select onChange={(e) => setGeneration(e.target.value)}>
          {[...Array(9)].map((_, idx) => (
            <option key={idx} value={idx + 1}>
              Generation {idx + 1}
            </option>
          ))}
        </select>
        <button
          onClick={() => generateRandomTeamFromGeneration(generation)}
          style={buttonStyle}
        >
          Genera un equipo de la generación {generation}
        </button>
      </div>

<<<<<<< Updated upstream
      <button onClick={generateLegendaryTeam} style={buttonStyle}>
        Genera un equipo de legendarios
      </button>
      <h2 style={title}>Gestiona tu equipo de Pokémon</h2>
=======
      <h2 style={title}>Tu equipo de Pokémon</h2>
>>>>>>> Stashed changes

      {/* Caja Busqueda */}
      <input
        type="text"
        placeholder="Buscar Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={searchStyle}
      />

      {/* Busqueda */}
      <div style={resultsContainerStyle}>
        {filteredResults.map((pokemon) => (
          <div
            key={pokemon.id}
            style={{ ...resultCardStyle, ":hover": hoverEffect }}
            onClick={() => addToTeam(pokemon)}
          >
            <h3>{pokemon.name}</h3>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          </div>
        ))}
      </div>

      {/* Equipo */}
      <h2>Tu equipo (máx. 10 Pokémon)</h2>
      <div style={teamContainerStyle}>
        {team.length === 0 ? (
          <p>No hay Pokémons en tu equipo</p>
        ) : (
          team.map((pokemon) => (
            <div key={pokemon.id} style={teamCardStyle}>
              <h3>{pokemon.name}</h3>
              <img
                src={
                  pokemon.showShiny
                    ? pokemon.sprites.front_shiny
                    : pokemon.sprites.front_default
                }
                alt={pokemon.name}
                onClick={() => openModal(pokemon)}
                style={pokemonImage}
              />
              <p style={tipostext}>
                Tipos:{" "}
                {pokemon.types.map((typeInfo) => typeInfo.type.name).join(", ")}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromTeam(pokemon.id);
                }}
                style={buttonStyle, deleteButtonStyle}
              >
                x
              </button>
              <div style={toggleContainerStyle}>
                <label>
                  <input
                    type="checkbox"
                    checked={pokemon.showShiny}
                    onChange={(e) => toggleShiny(pokemon.id, e)}
                  />
                  Mostrar versión Shiny
                </label>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={statsContainerStyle}>
        <h2>Resumen del Equipo</h2>
        <p>Peso Total: {stats.totalWeight}</p>
        <p>Altura Promedio: {stats.averageHeight.toFixed(2)}</p>
        <p>Tipos: {stats.types.join(", ")}</p>
      </div>

      {/* Fun: Get Random Pokémon */}
      <button onClick={fetchRandomPokemon} style={buttonStyle}>
        Ver Pokémon Aleatorio
      </button>

      {randomPokemon && (
        <div style={randomPokemonStyle}>
          <h3>{randomPokemon.name}</h3>
          <img
            src={randomPokemon.sprites.front_default}
            alt={randomPokemon.name}
          />
          <p>
            Peso: {randomPokemon.weight} | Altura: {randomPokemon.height}
          </p>
        </div>
      )}
    </div>
  );
}

// Inline styling
const containerStyle = {
  textAlign: "center",
  display: "flex",
  flexFlow: "column",
  background: `#525252`,
  alignItems: "center",
  background: `-webkit-linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6)`,
  background: `linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6)`,
  height:"100%",
  minHeight: "96vh",
};

const title = {
  color: "#fff", // Cambiado a un color más oscuro
  fontSize: "3rem", // Tamaño de fuente aumentado
};

const searchStyle = {
  padding: "12px", // Incrementado el padding
  width: "300px", // Ancho aumentado
  fontSize: "18px", // Tamaño de fuente aumentado
  margin: "25px 0", // Más espacio en los márgenes
  border: "2px solid #007bff", // Añadido borde azul
  borderRadius: "8px", // Bordes redondeados
};

const resultsContainerStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
};

const statsContainerStyle = {
  margin: "25px 0", // Margen superior ajustado
  padding: "15px", // Padding incrementado
  border: "2px solid #007bff", // Borde más grueso
  borderRadius: "12px", // Bordes redondeados
  backgroundColor: "#f8f9fa", // Fondo claro
};

const modalStyle = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  content: {
    color: "lightsteelblue",
    background: "#282c34",
    borderRadius: "8px",
    padding: "20px",
  },
};

const resultCardStyle = {
  border: "1px solid #007bff", // Borde azul
  borderRadius: "10px", // Bordes más redondeados
  padding: "12px", // Padding aumentado
  margin: "12px", // Margen aumentado
  cursor: "pointer",
  transition: "background-color 0.3s ease", // Transición suave para el hover
};

const teamContainerStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
};

const teamCardStyle = {
  border: "1px solid #007bff", // Borde azul
  borderRadius: "10px", // Bordes más redondeados
  padding: "12px", // Padding aumentado
  margin: "12px", // Margen aumentado
  cursor: "pointer",
  position: "relative",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra suave
  backgroundImage: `url(${pokeballImage})`, // Imagen de fondo
  backgroundSize: "cover", // Ajuste de la imagen
  backgroundPosition: "center", // Ajuste de la imagen
  color: "#fff", // Texto blanco
  display: "flex",
  flexFlow: "column",
  maxHeight: "15rem", // Altura máxima
};

const pokemonImage = {
  width: "100px", // Ancho de la imagen
  height: "100px", // Altura de la imagen
  margin: "0 auto", // Centrar la imagen
  display: "block", // Ajuste de bloque
};

const deleteButtonStyle = {
  backgroundColor: "#dc3545", // Fondo rojo
  color: "#fff", // Texto blanco
  cursor: "pointer",
  position: "relative",
  width: "30px", // Ancho del botón
  height: "30px", // Altura del botón
  minHeight: "30px", // Altura mínima
  textAlign: "center",
  right: '-175px',
  top: '-250px',
  borderRadius: "100%",
  padding:"0",
  border: "none",
};

const tipostext = {
  color: "#000",
  fontWeight: "bold",
  width: "50%",
  alignSelf: "center",
}

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "#fff",
  cursor: "pointer",
};

const toggleContainerStyle = {
};

const randomPokemonStyle = {
  textAlign: "center",
  marginTop: "20px",
};

const hoverEffect = {
  backgroundColor: "#f0f0f0",
};

export default Pokemons;
