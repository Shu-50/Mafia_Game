import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { getAlivePlayers } from "../utils/gameLogic";

const PlayerTurn = ({ player, onComplete }) => {
  const { recordNightAction } = useGame();
  const { players } = useGame();
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [selectedTarget, setSelectedTarget] = useState(null);

  const alivePlayers = getAlivePlayers(players);

  // Reset state when player changes
  useEffect(() => {
    setShowCountdown(true);
    setCountdown(5);
    setSelectedTarget(null);
  }, [player.id]);

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0) {
      setShowCountdown(false);
    }
  }, [showCountdown, countdown]);

  const handleSelectTarget = (playerId) => {
    setSelectedTarget(playerId);
  };

  const handleConfirm = () => {
    if (selectedTarget !== null) {
      recordNightAction(player.id, player.role, selectedTarget);
      onComplete();
    }
  };

  const getRoleEmoji = (role) => {
    switch (role) {
      case "mafia":
        return "🎭";
      case "doctor":
        return "🩺";
      case "villager":
        return "👤";
      default:
        return "👤";
    }
  };

  const getRoleTitle = (role) => {
    switch (role) {
      case "mafia":
        return "You are the MAFIA";
      case "doctor":
        return "You are the DOCTOR";
      case "villager":
        return "You are a VILLAGER";
      default:
        return "Your Role";
    }
  };

  const getRoleInstruction = (role) => {
    switch (role) {
      case "mafia":
        return "Select ONE player to eliminate";
      case "doctor":
        return "Select ONE player to save";
      case "villager":
        return "Select any player (your choice has no effect)";
      default:
        return "Select a player";
    }
  };

  const getButtonText = (role) => {
    switch (role) {
      case "mafia":
        return "Confirm Kill";
      case "doctor":
        return "Confirm Save";
      case "villager":
        return "Confirm Choice";
      default:
        return "Confirm";
    }
  };

  const getButtonClass = (role) => {
    switch (role) {
      case "mafia":
        return "btn-danger";
      case "doctor":
        return "btn-success";
      case "villager":
        return "btn-secondary";
      default:
        return "btn-primary";
    }
  };

  return (
    <div className="container">
      <div className="card fade-in">
        {showCountdown ? (
          <div className="text-center">
            <h2 className="mb-4">📱 Pass phone to:</h2>
            <h1 className="mb-5" style={{ fontSize: "3rem" }}>
              {player.name}
            </h1>
            <p className="text-secondary mb-4">Role will reveal in...</p>
            <div className="countdown">{countdown}</div>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
                {getRoleEmoji(player.role)}
              </div>
              <h2 className="mb-2">{getRoleTitle(player.role)}</h2>
              <p className="text-secondary">
                {getRoleInstruction(player.role)}
              </p>
            </div>

            <div className="grid gap-2 mb-4">
              {alivePlayers.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectTarget(p.id)}
                  className={`player-card ${selectedTarget === p.id ? "selected" : ""}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 style={{ marginBottom: "0.25rem" }}>{p.name}</h3>
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.875rem" }}
                      >
                        {p.id === player.id ? "(You)" : "Select"}
                      </span>
                    </div>
                    {selectedTarget === p.id && (
                      <div style={{ fontSize: "1.5rem" }}>✓</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleConfirm}
                disabled={selectedTarget === null}
                className={`btn ${getButtonClass(player.role)}`}
              >
                {getButtonText(player.role)}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerTurn;
