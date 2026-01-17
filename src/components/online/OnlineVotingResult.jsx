const OnlineVotingResult = ({
  result,
  showVoteDetails,
  onContinue,
  gameOver,
}) => {
  return (
    <div className="container">
      <div className="card fade-in text-center">
        <h1 className="mb-4">📊 Voting Results</h1>

        {result.eliminated ? (
          <div>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚖️</div>
            <h2 style={{ color: "#ef4444", marginBottom: "1rem" }}>
              {result.eliminated.name} was voted out!
            </h2>
            <p className="text-secondary mb-4">
              They were a{" "}
              <strong>{result.eliminated.role.toUpperCase()}</strong>
            </p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🤝</div>
            <h2 style={{ color: "#6b7280", marginBottom: "1rem" }}>
              No one was eliminated
            </h2>
            <p className="text-secondary mb-4">The vote was skipped or tied</p>
          </div>
        )}

        {/* Vote Details */}
        {showVoteDetails && result.voteDetails && (
          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: "0.5rem",
              textAlign: "left",
            }}
          >
            <h3 className="mb-3">Vote Breakdown</h3>
            <div className="grid gap-2">
              {Object.entries(result.voteDetails).map(([votedFor, voters]) => (
                <div
                  key={votedFor}
                  style={{
                    padding: "0.75rem",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    borderRadius: "0.375rem",
                  }}
                >
                  <strong>{votedFor}</strong>: {voters.length} vote
                  {voters.length !== 1 ? "s" : ""}
                  <p
                    style={{
                      fontSize: "0.875rem",
                      opacity: 0.7,
                      margin: "0.25rem 0 0 0",
                    }}
                  >
                    {voters.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onContinue}
          className="btn btn-primary"
          style={{
            fontSize: "1.25rem",
            padding: "1rem 2rem",
            marginTop: "2rem",
          }}
        >
          {gameOver ? "View Results" : "Continue to Night"}
        </button>
      </div>
    </div>
  );
};

export default OnlineVotingResult;
