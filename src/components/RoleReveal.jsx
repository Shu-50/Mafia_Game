import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";

const RoleReveal = () => {
  const { players, currentPlayerIndex, nextRoleReveal } = useGame();
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [showRole, setShowRole] = useState(false);
  const [roleTimer, setRoleTimer] = useState(5);

  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    // Reset state when player changes
    setShowCountdown(true);
    setCountdown(5);
    setShowRole(false);
    setRoleTimer(5);
  }, [currentPlayerIndex]);

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0) {
      setShowCountdown(false);
      setShowRole(true);
    }
  }, [showCountdown, countdown]);

  useEffect(() => {
    if (showRole && roleTimer > 0) {
      const timer = setTimeout(() => setRoleTimer(roleTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showRole && roleTimer === 0) {
      // Auto-hide role after 5 seconds
      setShowRole(false);
    }
  }, [showRole, roleTimer]);

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

  const getRoleDisplay = (role) => {
    return role.toUpperCase();
  };

  const handleNext = () => {
    nextRoleReveal();
  };

  return (
    <div className="container">
      <div className="card fade-in text-center">
        {showCountdown ? (
          <>
            <h2 className="mb-4">📱 Pass phone to:</h2>
            <h1 className="mb-5" style={{ fontSize: "3rem" }}>
              {currentPlayer.name}
            </h1>
            <p className="text-secondary mb-4">Role will reveal in...</p>
            <div className="countdown">{countdown}</div>
          </>
        ) : showRole ? (
          <>
            <h2 className="mb-3">👤 Player: {currentPlayer.name}</h2>
            <div className="mb-4">
              <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>
                {getRoleEmoji(currentPlayer.role)}
              </div>
              <h1 className="mb-2">Your Role:</h1>
              <div
                className={`role-badge ${currentPlayer.role}`}
                style={{ fontSize: "1.5rem", padding: "1rem 2rem" }}
              >
                {getRoleDisplay(currentPlayer.role)}
              </div>
            </div>
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>
              Role will auto-hide in {roleTimer}s
            </p>
          </>
        ) : (
          <>
            <h2 className="mb-4">✅ Role Revealed</h2>
            <p className="text-secondary mb-5">
              {currentPlayerIndex < players.length - 1
                ? "Pass the phone to the next player"
                : "All roles revealed! Ready to start?"}
            </p>
            <button onClick={handleNext} className="btn btn-primary">
              {currentPlayerIndex < players.length - 1
                ? "👉 Next Player"
                : "🎮 Start Game"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RoleReveal;
