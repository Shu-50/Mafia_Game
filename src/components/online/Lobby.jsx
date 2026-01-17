import { useEffect } from "react";
import { useMultiplayer } from "../../context/MultiplayerContext";

const Lobby = ({ onStartGame }) => {
  const {
    roomCode,
    players,
    myPlayerId,
    isHost,
    gameSettings,
    gameStarted,
    toggleReady,
    kickPlayer,
    updateSettings,
    startGame,
  } = useMultiplayer();

  const myPlayer = players.find((p) => p.id === myPlayerId);
  const allReady = players.length >= 4 && players.every((p) => p.isReady);

  // Watch for game start (for non-host players)
  useEffect(() => {
    if (gameStarted && !isHost) {
      console.log("Non-host: Game started, transitioning...");
      onStartGame();
    }
  }, [gameStarted, isHost, onStartGame]);

  const handleStartGame = () => {
    startGame();
    onStartGame();
  };

  const handleSettingToggle = (setting) => {
    updateSettings({
      ...gameSettings,
      [setting]: !gameSettings[setting],
    });
  };

  return (
    <div className="container">
      <div className="card fade-in">
        <div className="text-center mb-4">
          <h1>🎮 Game Lobby</h1>
          <div
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              backgroundColor: "rgba(139, 92, 246, 0.2)",
              border: "2px solid rgba(139, 92, 246, 0.5)",
              borderRadius: "0.75rem",
              marginTop: "1rem",
            }}
          >
            <p
              className="text-secondary"
              style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}
            >
              Room Code
            </p>
            <h2 style={{ letterSpacing: "0.3em", margin: 0 }}>{roomCode}</h2>
          </div>
        </div>

        {/* Players List */}
        <div className="mb-4">
          <h3 className="mb-3">
            Players ({players.length}/20)
            {players.length < 4 && (
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#ff6b6b",
                  marginLeft: "0.5rem",
                }}
              >
                (Minimum 4 required)
              </span>
            )}
          </h3>
          <div className="grid gap-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="card"
                style={{
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: player.isReady
                    ? "rgba(34, 197, 94, 0.1)"
                    : "rgba(255, 255, 255, 0.05)",
                  border: player.isReady
                    ? "1px solid rgba(34, 197, 94, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div>
                  <strong>{player.name}</strong>
                  {player.isHost && (
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "rgba(139, 92, 246, 0.3)",
                        borderRadius: "0.25rem",
                        fontSize: "0.75rem",
                      }}
                    >
                      HOST
                    </span>
                  )}
                  {player.id === myPlayerId && (
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        opacity: 0.7,
                        fontSize: "0.875rem",
                      }}
                    >
                      (You)
                    </span>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {player.isReady ? (
                    <span style={{ color: "#22c55e" }}>✓ Ready</span>
                  ) : (
                    <span style={{ opacity: 0.5 }}>Not Ready</span>
                  )}
                  {isHost && !player.isHost && (
                    <button
                      onClick={() => kickPlayer(player.id)}
                      className="btn"
                      style={{
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.875rem",
                        backgroundColor: "rgba(255, 0, 0, 0.2)",
                      }}
                    >
                      Kick
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Settings (Host Only) */}
        {isHost && (
          <div className="mb-4">
            <h3 className="mb-3">Game Settings</h3>
            <div className="grid gap-2">
              <div
                className="card"
                style={{
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>Show Vote Details</strong>
                  <p style={{ fontSize: "0.875rem", opacity: 0.7, margin: 0 }}>
                    Display who voted for whom
                  </p>
                </div>
                <button
                  onClick={() => handleSettingToggle("showVoteDetails")}
                  className="btn"
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: gameSettings.showVoteDetails
                      ? "rgba(34, 197, 94, 0.3)"
                      : "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {gameSettings.showVoteDetails ? "ON" : "OFF"}
                </button>
              </div>

              <div
                className="card"
                style={{
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>Night Phase Timer</strong>
                  <p style={{ fontSize: "0.875rem", opacity: 0.7, margin: 0 }}>
                    30-second countdown for night actions
                  </p>
                </div>
                <button
                  onClick={() => handleSettingToggle("nightTimer")}
                  className="btn"
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: gameSettings.nightTimer
                      ? "rgba(34, 197, 94, 0.3)"
                      : "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {gameSettings.nightTimer ? "ON" : "OFF"}
                </button>
              </div>

              <div
                className="card"
                style={{
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>Day Discussion Timer</strong>
                  <p style={{ fontSize: "0.875rem", opacity: 0.7, margin: 0 }}>
                    60-second countdown for discussion
                  </p>
                </div>
                <button
                  onClick={() => handleSettingToggle("dayTimer")}
                  className="btn"
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: gameSettings.dayTimer
                      ? "rgba(34, 197, 94, 0.3)"
                      : "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {gameSettings.dayTimer ? "ON" : "OFF"}
                </button>
              </div>

              <div
                className="card"
                style={{
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  opacity: 0.5,
                }}
              >
                <div>
                  <strong>Number of Mafia</strong>
                  <p style={{ fontSize: "0.875rem", opacity: 0.7, margin: 0 }}>
                    Currently disabled (set to 1)
                  </p>
                </div>
                <span style={{ padding: "0.5rem 1rem" }}>1</span>
              </div>
            </div>
          </div>
        )}

        {/* Ready/Start Controls */}
        <div className="grid gap-2">
          {!isHost && (
            <button onClick={toggleReady} className="btn btn-secondary">
              {myPlayer?.isReady ? "✓ Ready" : "Mark as Ready"}
            </button>
          )}

          {isHost && (
            <button
              onClick={handleStartGame}
              disabled={!allReady}
              className="btn btn-primary"
            >
              {allReady
                ? "Start Game"
                : `Waiting for players... (${players.filter((p) => p.isReady).length}/${players.length} ready)`}
            </button>
          )}
        </div>

        <div className="mt-3 text-center">
          <p className="text-muted" style={{ fontSize: "0.875rem" }}>
            Roles: 1 Mafia • 1 Doctor • {players.length - 2} Villagers
          </p>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
