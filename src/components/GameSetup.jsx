import { useState } from "react";
import { useGame } from "../context/GameContext";

const GameSetup = () => {
  const { setupGame } = useGame();
  const [numPlayers, setNumPlayers] = useState(4);
  const [playerNames, setPlayerNames] = useState(["", "", "", ""]);

  const handleNumPlayersChange = (e) => {
    const value = e.target.value;

    // Allow empty input while typing
    if (value === "") {
      setNumPlayers("");
      return;
    }

    const num = parseInt(value);

    // Only update if it's a valid number
    if (!isNaN(num)) {
      // Clamp between 4 and 20
      const clampedNum = Math.max(4, Math.min(20, num));
      setNumPlayers(clampedNum);
      const newNames = Array(clampedNum)
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
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              type="button"
              onClick={() => {
                const newNum = Math.max(4, numPlayers - 1);
                setNumPlayers(newNum);
                const newNames = Array(newNum)
                  .fill("")
                  .map((_, i) => playerNames[i] || "");
                setPlayerNames(newNames);
              }}
              className="btn btn-secondary"
              style={{ padding: "0.5rem 1rem", fontSize: "1.25rem" }}
            >
              ↓
            </button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={numPlayers}
              onChange={handleNumPlayersChange}
              className="input"
              style={{ textAlign: "center", maxWidth: "100px" }}
            />
            <button
              type="button"
              onClick={() => {
                const newNum = Math.min(20, numPlayers + 1);
                setNumPlayers(newNum);
                const newNames = Array(newNum)
                  .fill("")
                  .map((_, i) => playerNames[i] || "");
                setPlayerNames(newNames);
              }}
              className="btn btn-secondary"
              style={{ padding: "0.5rem 1rem", fontSize: "1.25rem" }}
            >
              ↑
            </button>
          </div>
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
