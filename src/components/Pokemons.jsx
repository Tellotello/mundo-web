import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

function Pokemons() {
  const [search, setSearch] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [team, setTeam] = useState([]);
  const [randomPokemon, setRandomPokemon] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = (pokemon) => {
    setSelectedPokemon(pokemon);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Fetch list of all Pokémon names
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=1000"
        );
        setPokemonList(response.data.results); // contains list of all Pokémon
      } catch (error) {
        console.error("Error fetching Pokémon list", error);
      }
    };

    fetchPokemonList();
  }, []);

  // Filter Pokémon by search input
  useEffect(() => {
    if (search === "") {
      setFilteredResults([]);
      return;
    }

    const filtered = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(search.toLowerCase())
    );

    // Fetch details of filtered Pokémon to get their sprites
    const fetchPokemonDetails = async () => {
      const detailedResults = await Promise.all(
        filtered.map(async (pokemon) => {
          const res = await axios.get(pokemon.url); // Pokémon URL has all the details
          return res.data;
        })
      );
      setFilteredResults(detailedResults);
    };

    fetchPokemonDetails();
  }, [search, pokemonList]);

  // Add a Pokémon to the team with initial shiny status
  const addToTeam = (pokemon) => {
    if (team.length < 6 && !team.find((p) => p.id === pokemon.id)) {
      setTeam([...team, { ...pokemon, showShiny: false }]);
    } else {
      alert("Your team can only have 6 Pokémon, and no duplicates!");
    }
  };

  // Remove a Pokémon from the team
  const removeFromTeam = (id) => {
    setTeam(team.filter((pokemon) => pokemon.id !== id));
  };

  // Toggle shiny status for a Pokémon in the team
  const toggleShiny = (id, e) => {
    e.stopPropagation(); // Prevent the modal from opening
    setTeam(
      team.map((pokemon) =>
        pokemon.id === id
          ? { ...pokemon, showShiny: !pokemon.showShiny }
          : pokemon
      )
    );
  };

  // Fetch random Pokémon info
  const fetchRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * 898) + 1; // Assuming 898 total Pokémon
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

  // Usage in render
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

      <h1>Gestiona tu equipo de Pokémon</h1>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Buscar Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={searchStyle}
      />

      {/* Search Results */}
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

      {/* Team Display */}
      <h2>Tu equipo (máx. 6 Pokémon)</h2>
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
              />
              <p>
                Tipos:{" "}
                {pokemon.types.map((typeInfo) => typeInfo.type.name).join(", ")}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the modal from opening when clicking "Eliminar"
                  removeFromTeam(pokemon.id);
                }}
                style={buttonStyle}
              >
                Eliminar
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
  padding: "20px",
};

const searchStyle = {
  padding: "10px",
  width: "250px",
  fontSize: "16px",
  margin: "20px 0",
};

const resultsContainerStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
};

const statsContainerStyle = {
  margin: "20px 0",
  padding: "10px",
  border: "1px solid #007bff",
  borderRadius: "8px",
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
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "10px",
  margin: "10px",
  cursor: "pointer",
};

const teamContainerStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
};

const teamCardStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "10px",
  margin: "10px",
  cursor: "pointer",
  position: "relative",
};

const buttonStyle = {
  margin: "10px",
  padding: "5px 10px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#007bff",
  color: "#fff",
  cursor: "pointer",
};

const toggleContainerStyle = {
  marginTop: "10px",
};

const randomPokemonStyle = {
  textAlign: "center",
  marginTop: "20px",
};

const hoverEffect = {
  backgroundColor: "#f0f0f0",
};

export default Pokemons;
