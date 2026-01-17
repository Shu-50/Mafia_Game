import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { getAlivePlayers } from "../utils/gameLogic";

const VotingPhase = () => {
  const { players, currentVoterIndex, recordVote, nextVoter } = useGame();
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [showPassPhone, setShowPassPhone] = useState(true);

  const alivePlayers = getAlivePlayers(players);
  const currentVoter = alivePlayers[currentVoterIndex];

  // Reset selection when voter changes
  useEffect(() => {
    setSelectedTarget(null);
    setShowPassPhone(true);
  }, [currentVoterIndex]);

  const handleSelectTarget = (playerId) => {
    setSelectedTarget(playerId);
  };

  const handleConfirmVote = () => {
    if (selectedTarget !== null) {
      recordVote(currentVoter.id, selectedTarget);
      nextVoter();
    }
  };

  const handleStartVoting = () => {
    setShowPassPhone(false);
  };

  if (!currentVoter) return null;

  return (
    <div className="container">
      <div className="card fade-in">
        {showPassPhone ? (
          <div className="text-center">
            <h2 className="mb-4">🗳️ Voting Time</h2>
            <h3 className="mb-4">Pass phone to:</h3>
            <h1 className="mb-5" style={{ fontSize: "3rem" }}>
              {currentVoter.name}
            </h1>
            <p className="text-secondary mb-4">
              Voter {currentVoterIndex + 1} of {alivePlayers.length}
            </p>
            <button onClick={handleStartVoting} className="btn btn-primary">
              Ready to Vote
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <h2 className="mb-2">🗳️ Cast Your Vote</h2>
              <p className="text-secondary">
                {currentVoter.name}, select who to eliminate
              </p>
              <p className="text-muted" style={{ fontSize: "0.875rem" }}>
                Voter {currentVoterIndex + 1} of {alivePlayers.length}
              </p>
            </div>

            <div className="grid gap-2 mb-4">
              {alivePlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => handleSelectTarget(player.id)}
                  className={`player-card ${selectedTarget === player.id ? "selected" : ""}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 style={{ marginBottom: "0.25rem" }}>{player.name}</h3>
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.875rem" }}
                      >
                        {player.id === currentVoter.id
                          ? "(You)"
                          : "Vote to eliminate"}
                      </span>
                    </div>
                    {selectedTarget === player.id && (
                      <div style={{ fontSize: "1.5rem" }}>✓</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleConfirmVote}
                disabled={selectedTarget === null}
                className="btn btn-primary"
              >
                Confirm Vote
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VotingPhase;
