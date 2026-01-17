import { useGame } from "../context/GameContext";

const GameOver = () => {
  const { winner, players, resetGame } = useGame();

  const handleNewGame = () => {
    resetGame();
  };

  const getWinnerDisplay = () => {
    if (winner === "villagers") {
      return {
        title: "👥 VILLAGERS WIN!",
        emoji: "🎉",
        color: "var(--accent-success)",
        message: "The Mafia has been eliminated!",
      };
    } else if (winner === "mafia") {
      return {
        title: "🎭 MAFIA WINS!",
        emoji: "😈",
        color: "var(--accent-danger)",
        message: "The Mafia has taken over the village!",
      };
    }
    return null;
  };

  const winnerInfo = getWinnerDisplay();

  return (
    <div className="container">
      <div className="card fade-in text-center">
        {winnerInfo && (
          <>
            <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>
              {winnerInfo.emoji}
            </div>
            <h1 className="mb-3" style={{ color: winnerInfo.color }}>
              {winnerInfo.title}
            </h1>
            <p className="text-secondary mb-5" style={{ fontSize: "1.25rem" }}>
              {winnerInfo.message}
            </p>
          </>
        )}

        <div className="mb-5">
          <h3 className="mb-3">Final Results</h3>
          <div className="grid gap-2">
            {players.map((player) => (
              <div
                key={player.id}
                className={`player-card ${!player.alive ? "dead" : ""}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 style={{ marginBottom: "0.25rem" }}>{player.name}</h3>
                    <span className={`role-badge ${player.role}`}>
                      {player.role.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: "1.5rem" }}>
                    {player.alive ? "✅" : "💀"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleNewGame} className="btn btn-primary">
          🎮 New Game
        </button>
      </div>
    </div>
  );
};

export default GameOver;
