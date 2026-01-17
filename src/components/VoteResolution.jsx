import { useGame } from "../context/GameContext";

const VoteResolution = () => {
  const { voteResult, nextRound } = useGame();

  const handleContinue = () => {
    nextRound();
  };

  return (
    <div className="container">
      <div className="card fade-in text-center">
        <h2 className="mb-4">⚖️ Vote Results</h2>

        {voteResult && voteResult.isTie ? (
          <>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🤝</div>
            <h1 className="mb-3" style={{ color: "var(--accent-warning)" }}>
              It's a Tie!
            </h1>
            <p className="text-secondary mb-4">No one was eliminated</p>
          </>
        ) : voteResult && voteResult.votedOutPlayer ? (
          <>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>💀</div>
            <h1 className="mb-3" style={{ color: "var(--accent-danger)" }}>
              {voteResult.votedOutPlayer.name} was voted out!
            </h1>
            <div className="mb-4">
              <span className={`role-badge ${voteResult.votedOutPlayer.role}`}>
                {voteResult.votedOutPlayer.role.toUpperCase()}
              </span>
            </div>
          </>
        ) : null}

        <button onClick={handleContinue} className="btn btn-primary">
          Continue to Next Round
        </button>
      </div>
    </div>
  );
};

export default VoteResolution;
