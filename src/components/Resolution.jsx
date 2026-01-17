import { useGame } from "../context/GameContext";

const Resolution = () => {
  const { nightResult, startVoting } = useGame();

  const handleContinue = () => {
    startVoting();
  };

  return (
    <div className="container">
      <div className="card fade-in text-center">
        <h2 className="mb-4">🌅 Morning Announcement</h2>

        {nightResult && nightResult.killedPlayer ? (
          <>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>💀</div>
            <h1 className="mb-3" style={{ color: "var(--accent-danger)" }}>
              {nightResult.killedPlayer.name} is dead!
            </h1>
            <p className="text-secondary mb-4">
              They were eliminated during the night
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✨</div>
            <h1 className="mb-3" style={{ color: "var(--accent-success)" }}>
              No one died tonight
            </h1>
            <p className="text-secondary mb-4">The doctor saved someone!</p>
          </>
        )}

        <button onClick={handleContinue} className="btn btn-primary">
          Continue to Voting
        </button>
      </div>
    </div>
  );
};

export default Resolution;
