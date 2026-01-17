// Pure functions for game mechanics

/**
 * Randomly assign roles to players
 * @param {Array} players - Array of player objects with name
 * @returns {Array} Players with assigned roles
 */
export const assignRoles = (players) => {
  // Create array of roles: 1 Mafia, 1 Doctor, rest Villagers
  const roles = ['mafia', 'doctor', ...Array(players.length - 2).fill('villager')];
  
  // Fisher-Yates shuffle the roles array
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }
  
  // Assign shuffled roles to players in their original order
  return players.map((player, index) => ({
    ...player,
    role: roles[index],
    alive: true,
  }));
};

/**
 * Resolve night actions
 * @param {number} mafiaTarget - ID of player targeted by mafia
 * @param {number} doctorTarget - ID of player saved by doctor
 * @param {Array} players - Current player state
 * @returns {Object} { players: updated players, killedPlayer: player object or null }
 */
export const resolveNightActions = (mafiaTarget, doctorTarget, players) => {
  let killedPlayer = null;

  // If mafia target is saved by doctor, no one dies
  if (mafiaTarget !== doctorTarget && mafiaTarget !== null) {
    killedPlayer = players.find((p) => p.id === mafiaTarget);

    const updatedPlayers = players.map((player) =>
      player.id === mafiaTarget ? { ...player, alive: false } : player,
    );

    return { players: updatedPlayers, killedPlayer };
  }

  return { players, killedPlayer: null };
};

/**
 * Resolve voting
 * @param {Object} votes - Object mapping player IDs to their vote target IDs
 * @param {Array} players - Current player state
 * @returns {Object} { players: updated players, votedOutPlayer: player object or null, isTie: boolean }
 */
export const resolveVoting = (votes, players) => {
  const voteCounts = {};

  // Count votes
  Object.values(votes).forEach((targetId) => {
    voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
  });

  // Find max votes
  const maxVotes = Math.max(...Object.values(voteCounts));
  const playersWithMaxVotes = Object.keys(voteCounts).filter(
    (id) => voteCounts[id] === maxVotes,
  );

  // Check for tie
  if (playersWithMaxVotes.length > 1) {
    return { players, votedOutPlayer: null, isTie: true };
  }

  // Eliminate player with most votes
  const votedOutId = parseInt(playersWithMaxVotes[0]);
  const votedOutPlayer = players.find((p) => p.id === votedOutId);

  const updatedPlayers = players.map((player) =>
    player.id === votedOutId ? { ...player, alive: false } : player,
  );

  return { players: updatedPlayers, votedOutPlayer, isTie: false };
};

/**
 * Check win condition
 * @param {Array} players - Current player state
 * @returns {string|null} 'villagers', 'mafia', or null
 */
export const checkWinCondition = (players) => {
  const alivePlayers = players.filter((p) => p.alive);
  const aliveMafia = alivePlayers.filter((p) => p.role === "mafia");
  const aliveVillagers = alivePlayers.filter((p) => p.role !== "mafia");

  // Villagers win if mafia is dead
  if (aliveMafia.length === 0) {
    return "villagers";
  }

  // Mafia wins if mafia count >= villager count
  if (aliveMafia.length >= aliveVillagers.length) {
    return "mafia";
  }

  return null;
};

/**
 * Get alive players
 * @param {Array} players - Current player state
 * @returns {Array} Alive players
 */
export const getAlivePlayers = (players) => {
  return players.filter((p) => p.alive);
};

/**
 * Find player by role
 * @param {Array} players - Current player state
 * @param {string} role - Role to find
 * @returns {Object|null} Player object or null
 */
export const findPlayerByRole = (players, role) => {
  return players.find((p) => p.role === role) || null;
};
