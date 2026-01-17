import { useState, useEffect } from "react";

const OnlineRoleReveal = ({ role, playerName, onContinue }) => {
  const [countdown, setCountdown] = useState(5);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (acknowledged) {
      // Auto-continue after countdown if acknowledged
      const timer = setTimeout(() => onContinue(), 3000);
      return () => clearTimeout(timer);
    }
  }, [countdown, acknowledged, onContinue]);

  const getRoleInfo = (role) => {
    switch (role) {
      case "mafia":
        return {
          emoji: "🔪",
          title: "MAFIA",
          color: "#ef4444",
          description: "Eliminate villagers during the night",
        };
      case "doctor":
        return {
          emoji: "💉",
          title: "DOCTOR",
          color: "#22c55e",
          description: "Save one player each night",
        };
      case "villager":
        return {
          emoji: "👤",
          title: "VILLAGER",
          color: "#3b82f6",
          description: "Find and vote out the Mafia",
        };
      default:
        return {
          emoji: "❓",
          title: "UNKNOWN",
          color: "#6b7280",
          description: "",
        };
    }
  };

  const roleInfo = getRoleInfo(role);

  return (
    <div className="container">
      <div className="card fade-in text-center">
        <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>
          {roleInfo.emoji}
        </div>

        <h1 style={{ color: roleInfo.color, marginBottom: "1rem" }}>
          {roleInfo.title}
        </h1>

        <p className="text-secondary mb-4">
          {playerName}, you are the <strong>{roleInfo.title}</strong>
        </p>

        <div
          style={{
            padding: "1rem",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "0.5rem",
            marginBottom: "2rem",
          }}
        >
          <p style={{ fontSize: "1.125rem" }}>{roleInfo.description}</p>
        </div>

        {countdown > 0 ? (
          <div>
            <p className="text-secondary mb-2">Memorize your role...</p>
            <div
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                color: roleInfo.color,
              }}
            >
              {countdown}
            </div>
          </div>
        ) : (
          <div>
            {!acknowledged ? (
              <button
                onClick={() => setAcknowledged(true)}
                className="btn btn-primary"
                style={{ fontSize: "1.25rem", padding: "1rem 2rem" }}
              >
                I'm Ready
              </button>
            ) : (
              <div>
                <p style={{ color: "#22c55e", fontSize: "1.25rem" }}>
                  ✓ Waiting for other players...
                </p>
                <p className="text-secondary" style={{ fontSize: "0.875rem" }}>
                  Starting in 3 seconds
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineRoleReveal;
