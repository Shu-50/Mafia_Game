import { useState } from "react";

const OnlineVotingPhase = ({ players, myPlayerId, onSubmit }) => {
  const [selectedVote, setSelectedVote] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const alivePlayers = players.filter((p) => p.alive);

  // Determine grid layout based on player count
  const gridColumns = alivePlayers.length > 4 ? 2 : 1;

  const handleSubmit = () => {
    if (selectedVote !== null) {
      setSubmitted(true);
      onSubmit(selectedVote);
    }
  };

  return (
    <div className="container">
      <div className="card fade-in">
        <div className="text-center mb-4">
          <h1>🗳️ Voting Phase</h1>
          <p className="text-secondary">Vote to eliminate a player or skip</p>
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
                  onClick={() => setSelectedVote(player.id)}
                  className={`player-card ${
                    selectedVote === player.id ? "selected" : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    borderColor:
                      selectedVote === player.id ? "#ef4444" : undefined,
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <h3 style={{ marginBottom: "0.5rem" }}>
                      {player.name}
                      {player.id === myPlayerId && (
                        <span
                          style={{
                            opacity: 0.5,
                            fontSize: "0.875rem",
                            marginLeft: "0.5rem",
                          }}
                        >
                          (You)
                        </span>
                      )}
                    </h3>
                    {selectedVote === player.id && (
                      <div
                        style={{
                          marginTop: "0.5rem",
                          padding: "0.25rem 0.75rem",
                          backgroundColor: "rgba(239, 68, 68, 0.2)",
                          borderRadius: "0.25rem",
                          color: "#ef4444",
                          fontSize: "0.875rem",
                        }}
                      >
                        Vote to Eliminate
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Skip option */}
              <div
                onClick={() => setSelectedVote("skip")}
                className={`player-card ${
                  selectedVote === "skip" ? "selected" : ""
                }`}
                style={{
                  cursor: "pointer",
                  borderColor: selectedVote === "skip" ? "#6b7280" : undefined,
                  gridColumn: gridColumns === 2 ? "1 / -1" : "auto",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ marginBottom: "0.5rem" }}>Skip Voting</h3>
                  {selectedVote === "skip" && (
                    <div
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.25rem 0.75rem",
                        backgroundColor: "rgba(107, 114, 128, 0.2)",
                        borderRadius: "0.25rem",
                        color: "#6b7280",
                        fontSize: "0.875rem",
                      }}
                    >
                      No Elimination
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={selectedVote === null}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Submit Vote
            </button>
          </>
        ) : (
          <div className="text-center">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
            <h2 style={{ color: "#22c55e", marginBottom: "0.5rem" }}>
              ✓ Vote Submitted
            </h2>
            <p className="text-secondary">
              Waiting for other players to vote...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineVotingPhase;
