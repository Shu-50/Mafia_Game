import { useState } from "react";

const ModeSelection = ({ onSelectMode }) => {
  return (
    <div className="container">
      <div className="card fade-in">
        <div className="text-center mb-4">
          <h1>🎭 MAFIA GAME</h1>
          <p className="text-secondary">Choose your game mode</p>
        </div>

        <div className="grid gap-3">
          <button
            onClick={() => onSelectMode("offline")}
            className="btn btn-primary"
            style={{ padding: "1.5rem", fontSize: "1.25rem" }}
          >
            🎮 Play Offline
            <p
              style={{
                fontSize: "0.875rem",
                marginTop: "0.5rem",
                opacity: 0.8,
              }}
            >
              Single device, pass-the-phone gameplay
            </p>
          </button>

          <button
            onClick={() => onSelectMode("online")}
            className="btn btn-secondary"
            style={{ padding: "1.5rem", fontSize: "1.25rem" }}
          >
            🌐 Play Online
            <p
              style={{
                fontSize: "0.875rem",
                marginTop: "0.5rem",
                opacity: 0.8,
              }}
            >
              Multiplayer with friends online
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelection;
