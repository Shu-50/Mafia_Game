import { useState } from "react";
import { useGame } from "../context/GameContext";

const GameSetup = () => {
  const { setupGame } = useGame();
  const [numPlayers, setNumPlayers] = useState(4);
  const [playerNames, setPlayerNames] = useState(["", "", "", ""]);

  const handleNumPlayersChange = (e) => {
    const num = parseInt(e.target.value);
    if (num >= 4 && num <= 20) {
      setNumPlayers(num);
      const newNames = Array(num)
        .fill("")
        .map((_, i) => playerNames[i] || "");
      setPlayerNames(newNames);
    }
  };

  const handleNameChange = (index, value) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    // Validate all names are filled
    const validNames = playerNames.filter((name) => name.trim() !== "");
    if (validNames.length === numPlayers) {
      setupGame(playerNames.map((name) => name.trim()));
    }
  };

  const isValid = playerNames.every((name) => name.trim() !== "");

  return (
    <div className="container">
      <div className="card fade-in">
        <div className="text-center mb-4">
          <h1>🎭 MAFIA GAME</h1>
          <p className="text-secondary">
            Single-device, pass-the-phone gameplay
          </p>
        </div>

        <div className="mb-4">
          <label className="text-secondary mb-2" style={{ display: "block" }}>
            Number of Players (minimum 4)
          </label>
          <input
            type="number"
            min="4"
            max="20"
            value={numPlayers}
            onChange={handleNumPlayersChange}
            className="input"
          />
        </div>

        <div className="mb-4">
          <h3 className="mb-3">Enter Player Names</h3>
          <div className="grid gap-2">
            {playerNames.map((name, index) => (
              <div
                key={index}
                className="slide-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <input
                  type="text"
                  placeholder={`Player ${index + 1} name`}
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="input"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleStartGame}
            disabled={!isValid}
            className="btn btn-primary"
          >
            Start Game
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-muted" style={{ fontSize: "0.875rem" }}>
            Roles: 1 Mafia • 1 Doctor • {numPlayers - 2} Villagers
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
