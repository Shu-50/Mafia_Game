import { useState, useEffect } from "react";
import { useMultiplayer } from "../../context/MultiplayerContext";
import {
  assignRoles,
  resolveNightActions,
  resolveVoting,
  checkWinCondition,
} from "../../utils/gameLogic";
import OnlineRoleReveal from "./OnlineRoleReveal";
import OnlineNightPhase from "./OnlineNightPhase";
import OnlineNightResult from "./OnlineNightResult";
import OnlineVotingPhase from "./OnlineVotingPhase";
import OnlineVotingResult from "./OnlineVotingResult";
import OnlineGameEnd from "./OnlineGameEnd";

const OnlineGame = ({ onReturnToLobby }) => {
  const {
    players: lobbyPlayers,
    myPlayerId,
    myPlayerName,
    isHost,
    gameSettings,
  } = useMultiplayer();

  const [gamePhase, setGamePhase] = useState("roleReveal"); // roleReveal, night, nightResult, voting, votingResult, gameEnd
  const [players, setPlayers] = useState([]);
  const [myRole, setMyRole] = useState(null);
  const [nightActions, setNightActions] = useState({});
  const [votes, setVotes] = useState({});
  const [nightResult, setNightResult] = useState(null);
  const [votingResult, setVotingResult] = useState(null);
  const [winner, setWinner] = useState(null);

  // Initialize game
  useEffect(() => {
    if (isHost) {
      // Host assigns roles
      const playersWithRoles = assignRoles(
        lobbyPlayers.map((p) => ({ id: p.id, name: p.name })),
      );
      setPlayers(playersWithRoles);

      // Broadcast to all players
      // TODO: Implement broadcasting
    }
  }, []);

  // Find my role
  useEffect(() => {
    const me = players.find((p) => p.id === myPlayerId);
    if (me) {
      setMyRole(me.role);
    }
  }, [players, myPlayerId]);

  // Handle role reveal continue
  const handleRoleRevealContinue = () => {
    setGamePhase("night");
  };

  // Handle night phase submission
  const handleNightSubmit = (targetId) => {
    setNightActions((prev) => ({
      ...prev,
      [myPlayerId]: targetId,
    }));

    // If host, check if all players have submitted
    if (isHost) {
      // TODO: Wait for all players, then resolve
      // For now, simulate immediate resolution
      setTimeout(() => {
        resolveNight();
      }, 2000);
    }
  };

  // Resolve night actions (host only)
  const resolveNight = () => {
    if (!isHost) return;

    // Get mafia and doctor targets
    const mafiaPlayer = players.find((p) => p.role === "mafia");
    const doctorPlayer = players.find((p) => p.role === "doctor");

    const mafiaTarget = nightActions[mafiaPlayer?.id] || null;
    const doctorTarget = nightActions[doctorPlayer?.id] || null;

    const result = resolveNightActions(mafiaTarget, doctorTarget, players);
    setPlayers(result.players);
    setNightResult({
      eliminated: result.killedPlayer,
    });

    // Check win condition
    const winCondition = checkWinCondition(result.players);
    if (winCondition) {
      setWinner(winCondition);
      setGamePhase("gameEnd");
    } else {
      setGamePhase("nightResult");
    }

    // Clear night actions
    setNightActions({});
  };

  // Handle night result continue
  const handleNightResultContinue = () => {
    setGamePhase("voting");
  };

  // Handle voting submission
  const handleVotingSubmit = (targetId) => {
    setVotes((prev) => ({
      ...prev,
      [myPlayerId]: targetId,
    }));

    // If host, check if all players have submitted
    if (isHost) {
      // TODO: Wait for all players, then resolve
      // For now, simulate immediate resolution
      setTimeout(() => {
        resolveVotes();
      }, 2000);
    }
  };

  // Resolve votes (host only)
  const resolveVotes = () => {
    if (!isHost) return;

    const result = resolveVoting(votes, players);
    setPlayers(result.players);

    // Build vote details for display
    const voteDetails = {};
    Object.entries(votes).forEach(([voterId, targetId]) => {
      const voter = players.find((p) => p.id === voterId);
      const targetName =
        targetId === "skip"
          ? "Skip"
          : players.find((p) => p.id === parseInt(targetId))?.name;

      if (!voteDetails[targetName]) {
        voteDetails[targetName] = [];
      }
      voteDetails[targetName].push(voter.name);
    });

    setVotingResult({
      eliminated: result.votedOutPlayer,
      voteDetails,
    });

    // Check win condition
    const winCondition = checkWinCondition(result.players);
    if (winCondition) {
      setWinner(winCondition);
      setGamePhase("gameEnd");
    } else {
      setGamePhase("votingResult");
    }

    // Clear votes
    setVotes({});
  };

  // Handle voting result continue
  const handleVotingResultContinue = () => {
    if (winner) {
      setGamePhase("gameEnd");
    } else {
      setGamePhase("night");
    }
  };

  // Render current phase
  const renderPhase = () => {
    switch (gamePhase) {
      case "roleReveal":
        return (
          <OnlineRoleReveal
            role={myRole}
            playerName={myPlayerName}
            onContinue={handleRoleRevealContinue}
          />
        );

      case "night":
        return (
          <OnlineNightPhase
            players={players}
            myRole={myRole}
            onSubmit={handleNightSubmit}
          />
        );

      case "nightResult":
        return (
          <OnlineNightResult
            result={nightResult}
            onContinue={handleNightResultContinue}
          />
        );

      case "voting":
        return (
          <OnlineVotingPhase
            players={players}
            myPlayerId={myPlayerId}
            onSubmit={handleVotingSubmit}
          />
        );

      case "votingResult":
        return (
          <OnlineVotingResult
            result={votingResult}
            showVoteDetails={gameSettings.showVoteDetails}
            onContinue={handleVotingResultContinue}
            gameOver={!!winner}
          />
        );

      case "gameEnd":
        return (
          <OnlineGameEnd
            winner={winner}
            players={players}
            onReturnToLobby={onReturnToLobby}
          />
        );

      default:
        return <div>Loading...</div>;
    }
  };

  return <div>{renderPhase()}</div>;
};

export default OnlineGame;
