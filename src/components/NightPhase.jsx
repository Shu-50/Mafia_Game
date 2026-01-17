import { useGame } from "../context/GameContext";
import PlayerTurn from "./PlayerTurn";

const NightPhase = () => {
  const { nightPlayerOrder, currentNightPlayerIndex, nextNightPlayer } =
    useGame();

  // Get current player from randomized order
  const currentPlayer = nightPlayerOrder[currentNightPlayerIndex];

  if (!currentPlayer) {
    return null;
  }

  return <PlayerTurn player={currentPlayer} onComplete={nextNightPlayer} />;
};

export default NightPhase;
