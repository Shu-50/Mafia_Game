const OnlineGameEnd = ({ winner, players, onReturnToLobby }) => {
  const isVillagersWin = winner === "villagers";

  return (
    <div className="container">
      <div className="card fade-in text-center">
        <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>
          {isVillagersWin ? "🎉" : "🔪"}
        </div>

        <h1
          style={{
            color: isVillagersWin ? "#22c55e" : "#ef4444",
            marginBottom: "1rem",
          }}
        >
          {isVillagersWin ? "VILLAGERS WIN!" : "MAFIA WINS!"}
        </h1>

        <p className="text-secondary mb-4" style={{ fontSize: "1.125rem" }}>
          {isVillagersWin
            ? "The Mafia has been eliminated!"
            : "The Mafia has taken over the village!"}
        </p>

        {/* Player Roles */}
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "0.5rem",
          }}
        >
          <h3 className="mb-3">Player Roles</h3>
          <div className="grid gap-2">
            {players.map((player) => (
              <div
                key={player.id}
                style={{
                  padding: "0.75rem",
                  backgroundColor:
                    player.role === "mafia"
                      ? "rgba(239, 68, 68, 0.1)"
                      : player.role === "doctor"
                        ? "rgba(34, 197, 94, 0.1)"
                        : "rgba(59, 130, 246, 0.1)",
                  border: `1px solid ${
                    player.role === "mafia"
                      ? "rgba(239, 68, 68, 0.3)"
                      : player.role === "doctor"
                        ? "rgba(34, 197, 94, 0.3)"
                        : "rgba(59, 130, 246, 0.3)"
                  }`,
                  borderRadius: "0.375rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  <strong>{player.name}</strong>
                  {!player.alive && (
                    <span style={{ opacity: 0.5, marginLeft: "0.5rem" }}>
                      (Eliminated)
                    </span>
                  )}
                </span>
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    backgroundColor:
                      player.role === "mafia"
                        ? "rgba(239, 68, 68, 0.2)"
                        : player.role === "doctor"
                          ? "rgba(34, 197, 94, 0.2)"
                          : "rgba(59, 130, 246, 0.2)",
                    borderRadius: "0.25rem",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                >
                  {player.role === "mafia" && "🔪 Mafia"}
                  {player.role === "doctor" && "💉 Doctor"}
                  {player.role === "villager" && "👤 Villager"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onReturnToLobby}
          className="btn btn-primary"
          style={{
            fontSize: "1.25rem",
            padding: "1rem 2rem",
            marginTop: "2rem",
          }}
        >
          Return to Lobby
        </button>
      </div>
    </div>
  );
};

export default OnlineGameEnd;
