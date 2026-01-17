import { useState } from "react";
import { useMultiplayer } from "../../context/MultiplayerContext";

const JoinRoom = ({ onRoomJoined, onBack }) => {
  const { joinRoom } = useMultiplayer();
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!roomCode.trim()) {
      setError("Please enter a room code");
      return;
    }

    setIsJoining(true);
    setError("");

    try {
      await joinRoom(roomCode.trim().toUpperCase(), playerName.trim());
      onRoomJoined();
    } catch (err) {
      setError("Failed to join room. Please check the code and try again.");
      setIsJoining(false);
    }
  };

  return (
    <div className="container">
      <div className="card fade-in">
        <div className="text-center mb-4">
          <h1>🔗 Join Room</h1>
          <p className="text-secondary">Enter room code to join a game</p>
        </div>

        <div className="mb-3">
          <label className="text-secondary mb-2" style={{ display: "block" }}>
            Your Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="input"
            disabled={isJoining}
            autoFocus
          />
        </div>

        <div className="mb-4">
          <label className="text-secondary mb-2" style={{ display: "block" }}>
            Room Code
          </label>
          <input
            type="text"
            placeholder="Enter 6-character code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
            className="input"
            disabled={isJoining}
            maxLength={6}
            style={{ textTransform: "uppercase", letterSpacing: "0.2em" }}
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
            onClick={handleJoinRoom}
            disabled={isJoining || !playerName.trim() || !roomCode.trim()}
            className="btn btn-primary"
          >
            {isJoining ? "Joining..." : "Join Room"}
          </button>

          <button
            onClick={onBack}
            disabled={isJoining}
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

export default JoinRoom;
