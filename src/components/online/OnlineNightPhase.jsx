import { useState } from "react";

const OnlineNightPhase = ({ players, myRole, onSubmit }) => {
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const alivePlayers = players.filter((p) => p.alive);

  // Determine grid layout based on player count
  const gridColumns = alivePlayers.length > 4 ? 2 : 1;

  const handleSubmit = () => {
    if (selectedTarget !== null) {
      setSubmitted(true);
      onSubmit(selectedTarget);
    }
  };

  const getRoleAction = (role) => {
    switch (role) {
      case "mafia":
        return { action: "Eliminate", color: "#ef4444" };
      case "doctor":
        return { action: "Save", color: "#22c55e" };
      default:
        return { action: "Select", color: "#3b82f6" };
    }
  };

  const roleAction = getRoleAction(myRole);

  return (
    <div className="container">
      <div className="card fade-in">
        <div className="text-center mb-4">
          <h1>🌙 Night Phase</h1>
          <p className="text-secondary">
            {myRole === "mafia" && "Choose a player to eliminate"}
            {myRole === "doctor" && "Choose a player to save"}
            {myRole === "villager" &&
              "Select any player (your choice won't affect the game)"}
          </p>
        </div>

        {!submitted ? (
          <>
            <div
              className="grid gap-3 mb-4"
              style={{
                gridTemplateColumns:
                  gridColumns === 2 ? "repeat(2, 1fr)" : "1fr",
              }}
            >
              {alivePlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => setSelectedTarget(player.id)}
                  className={`player-card ${
                    selectedTarget === player.id ? "selected" : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    borderColor:
                      selectedTarget === player.id
                        ? roleAction.color
                        : undefined,
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <h3 style={{ marginBottom: "0.5rem" }}>{player.name}</h3>
                    {selectedTarget === player.id && (
                      <div
                        style={{
                          marginTop: "0.5rem",
                          padding: "0.25rem 0.75rem",
                          backgroundColor: `${roleAction.color}33`,
                          borderRadius: "0.25rem",
                          color: roleAction.color,
                          fontSize: "0.875rem",
                        }}
                      >
                        {roleAction.action}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={selectedTarget === null}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Submit Choice
            </button>
          </>
        ) : (
          <div className="text-center">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
            <h2 style={{ color: "#22c55e", marginBottom: "0.5rem" }}>
              ✓ Choice Submitted
            </h2>
            <p className="text-secondary">
              Waiting for other players to submit their choices...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineNightPhase;
