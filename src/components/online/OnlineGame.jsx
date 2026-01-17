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
    gameStateUpdate,
    broadcastGameState,
  } = useMultiplayer();

  const [gamePhase, setGamePhase] = useState("roleReveal");
  const [players, setPlayers] = useState([]);
  const [myRole, setMyRole] = useState(null);
  const [playersReady, setPlayersReady] = useState({});
  const [nightActions, setNightActions] = useState({});
  const [votes, setVotes] = useState({});
  const [nightResult, setNightResult] = useState(null);
  const [votingResult, setVotingResult] = useState(null);
  const [winner, setWinner] = useState(null);

  // Initialize game (host assigns roles)
  useEffect(() => {
    if (isHost && lobbyPlayers.length > 0 && players.length === 0) {
      const playersWithRoles = assignRoles(
        lobbyPlayers.map((p) => ({ id: p.id, name: p.name })),
      );
      console.log("Host assigned roles:", playersWithRoles);
      setPlayers(playersWithRoles);

      // Broadcast roles to all players
      broadcastGameState({
        type: "rolesAssigned",
        players: playersWithRoles,
      });
    }
  }, [isHost, lobbyPlayers, players.length, broadcastGameState]);

  // Listen for game state updates
  useEffect(() => {
    if (!gameStateUpdate) return;

    console.log("Received game state update:", gameStateUpdate);

    switch (gameStateUpdate.type) {
      case "rolesAssigned":
        setPlayers(gameStateUpdate.players);
        break;

      case "phaseChange":
        console.log("Phase changing to:", gameStateUpdate.phase);
        setGamePhase(gameStateUpdate.phase);
        setPlayersReady({}); // Reset ready status for new phase
        break;

      case "nightResult":
        setNightResult(gameStateUpdate.result);
        setPlayers(gameStateUpdate.players);
        if (gameStateUpdate.winner) {
          setWinner(gameStateUpdate.winner);
        }
        break;

      case "votingResult":
        setVotingResult(gameStateUpdate.result);
        setPlayers(gameStateUpdate.players);
        if (gameStateUpdate.winner) {
          setWinner(gameStateUpdate.winner);
        }
        break;

      default:
        break;
    }
  }, [gameStateUpdate]);

  // Find my role
  useEffect(() => {
    const me = players.find((p) => p.id === myPlayerId);
    if (me) {
      console.log("My role:", me.role);
      setMyRole(me.role);
    }
  }, [players, myPlayerId]);

  // Handle player ready (role reveal phase)
  const handleRoleRevealReady = () => {
    const newReady = { ...playersReady, [myPlayerId]: true };
    setPlayersReady(newReady);

    // Send ready signal to host
    broadcastGameState({
      type: "playerReady",
      playerId: myPlayerId,
      phase: "roleReveal",
    });

    // If host, check if all players are ready
    if (isHost) {
      checkAllPlayersReady(newReady, "night");
    }
  };

  // Check if all players are ready and transition
  const checkAllPlayersReady = (readyStatus, nextPhase) => {
    const allReady = players.every((p) => readyStatus[p.id]);
    console.log("Checking ready status:", readyStatus, "All ready:", allReady);

    if (allReady) {
      console.log("All players ready, transitioning to:", nextPhase);
      setTimeout(() => {
        setGamePhase(nextPhase);
        setPlayersReady({});
        broadcastGameState({
          type: "phaseChange",
          phase: nextPhase,
        });
      }, 1000);
    }
  };

  // Handle night phase submission
  const handleNightSubmit = (targetId) => {
    const newActions = {
      ...nightActions,
      [myPlayerId]: targetId,
    };
    setNightActions(newActions);

    // Send action to host
    broadcastGameState({
      type: "nightAction",
      playerId: myPlayerId,
      targetId,
    });

    // If host, check if all players have submitted
    if (isHost) {
      setTimeout(() => {
        checkNightActionsComplete(newActions);
      }, 500);
    }
  };

  // Check if all night actions are complete
  const checkNightActionsComplete = (actions) => {
    const allSubmitted = players
      .filter((p) => p.alive)
      .every((p) => actions[p.id] !== undefined);

    if (allSubmitted) {
      console.log("All night actions submitted, resolving...");
      resolveNight(actions);
    }
  };

  // Resolve night actions (host only)
  const resolveNight = (actions) => {
    if (!isHost) return;

    const mafiaPlayer = players.find((p) => p.role === "mafia" && p.alive);
    const doctorPlayer = players.find((p) => p.role === "doctor" && p.alive);

    const mafiaTarget = actions[mafiaPlayer?.id] || null;
    const doctorTarget = actions[doctorPlayer?.id] || null;

    const result = resolveNightActions(mafiaTarget, doctorTarget, players);
    const updatedPlayers = result.players;

    setPlayers(updatedPlayers);
    setNightResult({ eliminated: result.killedPlayer });
    setNightActions({});

    // Check win condition
    const winCondition = checkWinCondition(updatedPlayers);
    if (winCondition) {
      setWinner(winCondition);
    }

    // Broadcast result to all players
    broadcastGameState({
      type: "nightResult",
      result: { eliminated: result.killedPlayer },
      players: updatedPlayers,
      winner: winCondition,
    });

    // Transition to night result phase
    setTimeout(() => {
      const nextPhase = winCondition ? "gameEnd" : "nightResult";
      setGamePhase(nextPhase);
      broadcastGameState({
        type: "phaseChange",
        phase: nextPhase,
      });
    }, 1000);
  };

  // Handle night result continue
  const handleNightResultContinue = () => {
    if (isHost) {
      setGamePhase("voting");
      broadcastGameState({
        type: "phaseChange",
        phase: "voting",
      });
    }
  };

  // Handle voting submission
  const handleVotingSubmit = (targetId) => {
    const newVotes = {
      ...votes,
      [myPlayerId]: targetId,
    };
    setVotes(newVotes);

    // Send vote to host
    broadcastGameState({
      type: "vote",
      playerId: myPlayerId,
      targetId,
    });

    // If host, check if all players have voted
    if (isHost) {
      setTimeout(() => {
        checkVotesComplete(newVotes);
      }, 500);
    }
  };

  // Check if all votes are complete
  const checkVotesComplete = (currentVotes) => {
    const alivePlayers = players.filter((p) => p.alive);
    const allVoted = alivePlayers.every(
      (p) => currentVotes[p.id] !== undefined,
    );

    if (allVoted) {
      console.log("All votes submitted, resolving...");
      resolveVotes(currentVotes);
    }
  };

  // Resolve votes (host only)
  const resolveVotes = (currentVotes) => {
    if (!isHost) return;

    const result = resolveVoting(currentVotes, players);
    const updatedPlayers = result.players;

    setPlayers(updatedPlayers);

    // Build vote details
    const voteDetails = {};
    Object.entries(currentVotes).forEach(([voterId, targetId]) => {
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
    setVotes({});

    // Check win condition
    const winCondition = checkWinCondition(updatedPlayers);
    if (winCondition) {
      setWinner(winCondition);
    }

    // Broadcast result to all players
    broadcastGameState({
      type: "votingResult",
      result: {
        eliminated: result.votedOutPlayer,
        voteDetails,
      },
      players: updatedPlayers,
      winner: winCondition,
    });

    // Transition to voting result phase
    setTimeout(() => {
      const nextPhase = winCondition ? "gameEnd" : "votingResult";
      setGamePhase(nextPhase);
      broadcastGameState({
        type: "phaseChange",
        phase: nextPhase,
      });
    }, 1000);
  };

  // Handle voting result continue
  const handleVotingResultContinue = () => {
    if (isHost) {
      const nextPhase = winner ? "gameEnd" : "night";
      setGamePhase(nextPhase);
      broadcastGameState({
        type: "phaseChange",
        phase: nextPhase,
      });
    }
  };

  // Listen for player actions (non-host)
  useEffect(() => {
    if (isHost || !gameStateUpdate) return;

    if (gameStateUpdate.type === "playerReady") {
      setPlayersReady((prev) => ({
        ...prev,
        [gameStateUpdate.playerId]: true,
      }));
    } else if (gameStateUpdate.type === "nightAction") {
      setNightActions((prev) => ({
        ...prev,
        [gameStateUpdate.playerId]: gameStateUpdate.targetId,
      }));
    } else if (gameStateUpdate.type === "vote") {
      setVotes((prev) => ({
        ...prev,
        [gameStateUpdate.playerId]: gameStateUpdate.targetId,
      }));
    }
  }, [gameStateUpdate, isHost]);

  // Render current phase
  const renderPhase = () => {
    switch (gamePhase) {
      case "roleReveal":
        return (
          <OnlineRoleReveal
            role={myRole}
            playerName={myPlayerName}
            onReady={handleRoleRevealReady}
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
