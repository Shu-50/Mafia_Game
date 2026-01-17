import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { findPlayerByRole, getAlivePlayers } from "../utils/gameLogic";

const DoctorTurn = ({ onComplete }) => {
  const { players, setDoctorSaveTarget } = useGame();
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [selectedTarget, setSelectedTarget] = useState(null);

  const doctorPlayer = findPlayerByRole(players, "doctor");
  const alivePlayers = getAlivePlayers(players);

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
      setDoctorSaveTarget(selectedTarget);
      onComplete();
    }
  };

  if (!doctorPlayer) return null;

  return (
    <div className="container">
      <div className="card fade-in">
        {showCountdown ? (
          <div className="text-center">
            <h2 className="mb-4">📱 Pass phone to:</h2>
            <h1 className="mb-5" style={{ fontSize: "3rem" }}>
              {doctorPlayer.name}
            </h1>
            <p className="text-secondary mb-4">Role will reveal in...</p>
            <div className="countdown">{countdown}</div>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🩺</div>
              <h2 className="mb-2">You are the DOCTOR</h2>
              <p className="text-secondary">Select ONE player to save</p>
            </div>

            <div className="grid gap-2 mb-4">
              {alivePlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => handleSelectTarget(player.id)}
                  className={`player-card ${selectedTarget === player.id ? "selected" : ""}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 style={{ marginBottom: "0.25rem" }}>{player.name}</h3>
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.875rem" }}
                      >
                        {player.id === doctorPlayer.id ? "(You)" : "Save"}
                      </span>
                    </div>
                    {selectedTarget === player.id && (
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
                className="btn btn-success"
              >
                Confirm Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorTurn;
