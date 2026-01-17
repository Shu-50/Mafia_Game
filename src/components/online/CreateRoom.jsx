import { useState } from "react";
import { useMultiplayer } from "../../context/MultiplayerContext";

const CreateRoom = ({ onRoomCreated, onBack }) => {
  const { createRoom } = useMultiplayer();
  const [playerName, setPlayerName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const code = await createRoom(playerName.trim());
      onRoomCreated(code);
    } catch (err) {
      setError("Failed to create room. Please try again.");
      setIsCreating(false);
    }
  };

  return (
    <div className="container">
      <div className="card fade-in">
        <div className="text-center mb-4">
          <h1>➕ Create Room</h1>
          <p className="text-secondary">Enter your name to host a game</p>
        </div>

        <div className="mb-4">
          <label className="text-secondary mb-2" style={{ display: "block" }}>
            Your Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCreateRoom()}
            className="input"
            disabled={isCreating}
            autoFocus
          />
        </div>

        {error && (
          <div
            className="mb-3"
            style={{
              padding: "0.75rem",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              border: "1px solid rgba(255, 0, 0, 0.3)",
              borderRadius: "0.5rem",
              color: "#ff6b6b",
            }}
          >
            {error}
          </div>
        )}

        <div className="grid gap-2">
          <button
            onClick={handleCreateRoom}
            disabled={isCreating || !playerName.trim()}
            className="btn btn-primary"
          >
            {isCreating ? "Creating..." : "Create Room"}
          </button>

          <button
            onClick={onBack}
            disabled={isCreating}
            className="btn"
            style={{ opacity: 0.7 }}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
