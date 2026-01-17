const OnlineNightResult = ({ result, onContinue }) => {
  return (
    <div className="container">
      <div className="card fade-in text-center">
        <h1 className="mb-4">🌅 Morning</h1>

        {result.eliminated ? (
          <div>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>💀</div>
            <h2 style={{ color: "#ef4444", marginBottom: "1rem" }}>
              {result.eliminated.name} was eliminated!
            </h2>
            <p className="text-secondary mb-4">
              The Mafia struck during the night...
            </p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✨</div>
            <h2 style={{ color: "#22c55e", marginBottom: "1rem" }}>
              Everyone survived the night!
            </h2>
            <p className="text-secondary mb-4">
              The Doctor saved the Mafia's target
            </p>
          </div>
        )}

        <button
          onClick={onContinue}
          className="btn btn-primary"
          style={{ fontSize: "1.25rem", padding: "1rem 2rem" }}
        >
          Continue to Voting
        </button>
      </div>
    </div>
  );
};

export default OnlineNightResult;
