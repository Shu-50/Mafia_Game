import { createContext, useContext, useState } from "react";
import {
  assignRoles,
  resolveNightActions,
  resolveVoting,
  checkWinCondition,
} from "../utils/gameLogic";

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
};

export const GameProvider = ({ children }) => {
  // Game phases: 'setup', 'roleReveal', 'night', 'resolution', 'voting', 'voteResolution', 'gameOver'
  const [phase, setPhase] = useState("setup");
  const [players, setPlayers] = useState([]);
  const [round, setRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // Night action targets
  const [mafiaTarget, setMafiaTarget] = useState(null);
  const [doctorTarget, setDoctorTarget] = useState(null);
  const [nightActions, setNightActions] = useState({}); // Store all night actions
  const [nightPlayerOrder, setNightPlayerOrder] = useState([]); // Randomized order
  const [currentNightPlayerIndex, setCurrentNightPlayerIndex] = useState(0);

  // Voting
  const [votes, setVotes] = useState({});
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);

  // Results
  const [nightResult, setNightResult] = useState(null);
  const [voteResult, setVoteResult] = useState(null);
  const [winner, setWinner] = useState(null);

  // Setup game with player names
  const setupGame = (playerNames) => {
    const playersWithNames = playerNames.map((name, index) => ({
      name,
      id: index,
    }));

    const playersWithRoles = assignRoles(playersWithNames);
    setPlayers(playersWithRoles);
    setPhase("roleReveal");
    setCurrentPlayerIndex(0);
  };

  // Move to next player in role reveal
  const nextRoleReveal = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else {
      // All roles revealed, start night phase
      initializeNightPhase();
    }
  };

  // Initialize night phase with randomized player order
  const initializeNightPhase = () => {
    const alivePlayers = players.filter((p) => p.alive);
    // Shuffle alive players for random order
    const shuffled = [...alivePlayers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setNightPlayerOrder(shuffled);
    setCurrentNightPlayerIndex(0);
    setNightActions({});
    setPhase("night");
  };

  // Record night action from any player
  const recordNightAction = (playerId, role, targetId) => {
    setNightActions((prev) => ({ ...prev, [playerId]: { role, targetId } }));

    // Store specific targets for Mafia and Doctor
    if (role === "mafia") {
      setMafiaTarget(targetId);
    } else if (role === "doctor") {
      setDoctorTarget(targetId);
    }
  };

  // Move to next player in night phase
  const nextNightPlayer = () => {
    if (currentNightPlayerIndex < nightPlayerOrder.length - 1) {
      setCurrentNightPlayerIndex(currentNightPlayerIndex + 1);
    } else {
      // All players have acted, resolve night
      resolveNight();
    }
  };

  // Set mafia kill target (legacy support)
  const setMafiaKillTarget = (targetId) => {
    setMafiaTarget(targetId);
  };

  // Set doctor save target (legacy support)
  const setDoctorSaveTarget = (targetId) => {
    setDoctorTarget(targetId);
  };

  // Resolve night actions
  const resolveNight = () => {
    const result = resolveNightActions(mafiaTarget, doctorTarget, players);
    setPlayers(result.players);
    setNightResult(result);

    // Check win condition
    const winCondition = checkWinCondition(result.players);
    if (winCondition) {
      setWinner(winCondition);
      setPhase("gameOver");
    } else {
      setPhase("resolution");
    }
  };

  // Move to voting phase
  const startVoting = () => {
    setPhase("voting");
    setCurrentVoterIndex(0);
    setVotes({});
  };

  // Record a vote
  const recordVote = (voterId, targetId) => {
    setVotes((prev) => ({ ...prev, [voterId]: targetId }));
  };

  // Move to next voter
  const nextVoter = () => {
    const alivePlayers = players.filter((p) => p.alive);
    if (currentVoterIndex < alivePlayers.length - 1) {
      setCurrentVoterIndex(currentVoterIndex + 1);
    } else {
      // All votes cast, resolve
      resolveVote();
    }
  };

  // Resolve voting
  const resolveVote = () => {
    const result = resolveVoting(votes, players);
    setPlayers(result.players);
    setVoteResult(result);

    // Check win condition
    const winCondition = checkWinCondition(result.players);
    if (winCondition) {
      setWinner(winCondition);
      setPhase("gameOver");
    } else {
      setPhase("voteResolution");
    }
  };

  // Start next round
  const nextRound = () => {
    setRound(round + 1);
    setMafiaTarget(null);
    setDoctorTarget(null);
    setNightActions({});
    setVotes({});
    setNightResult(null);
    setVoteResult(null);
    initializeNightPhase();
  };

  // Reset game
  const resetGame = () => {
    setPhase("setup");
    setPlayers([]);
    setRound(1);
    setCurrentPlayerIndex(0);
    setMafiaTarget(null);
    setDoctorTarget(null);
    setNightActions({});
    setNightPlayerOrder([]);
    setCurrentNightPlayerIndex(0);
    setVotes({});
    setCurrentVoterIndex(0);
    setNightResult(null);
    setVoteResult(null);
    setWinner(null);
  };

  const value = {
    // State
    phase,
    players,
    round,
    currentPlayerIndex,
    mafiaTarget,
    doctorTarget,
    nightActions,
    nightPlayerOrder,
    currentNightPlayerIndex,
    votes,
    currentVoterIndex,
    nightResult,
    voteResult,
    winner,

    // Actions
    setupGame,
    nextRoleReveal,
    initializeNightPhase,
    recordNightAction,
    nextNightPlayer,
    setMafiaKillTarget,
    setDoctorSaveTarget,
    resolveNight,
    startVoting,
    recordVote,
    nextVoter,
    nextRound,
    resetGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
