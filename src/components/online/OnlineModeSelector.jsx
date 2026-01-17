const OnlineModeSelector = ({ onCreateRoom, onJoinRoom, onBack }) => {
  return (
    <div className="container">
      <div className="card fade-in">
        <div className="text-center mb-4">
          <h1>🌐 Online Mode</h1>
          <p className="text-secondary">Create or join a game room</p>
        </div>

        <div className="grid gap-3">
          <button
            onClick={onCreateRoom}
            className="btn btn-primary"
            style={{ padding: "1.5rem", fontSize: "1.25rem" }}
          >
            ➕ Create Room
            <p
              style={{
                fontSize: "0.875rem",
                marginTop: "0.5rem",
                opacity: 0.8,
              }}
            >
              Host a new game
            </p>
          </button>

          <button
            onClick={onJoinRoom}
            className="btn btn-secondary"
            style={{ padding: "1.5rem", fontSize: "1.25rem" }}
          >
            🔗 Join Room
            <p
              style={{
                fontSize: "0.875rem",
                marginTop: "0.5rem",
                opacity: 0.8,
              }}
            >
              Enter a room code
            </p>
          </button>
        </div>

        <div className="text-center mt-4">
          <button onClick={onBack} className="btn" style={{ opacity: 0.7 }}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnlineModeSelector;
