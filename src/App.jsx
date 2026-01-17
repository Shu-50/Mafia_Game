import { GameProvider, useGame } from "./context/GameContext";
import GameSetup from "./components/GameSetup";
import RoleReveal from "./components/RoleReveal";
import NightPhase from "./components/NightPhase";
import Resolution from "./components/Resolution";
import VotingPhase from "./components/VotingPhase";
import VoteResolution from "./components/VoteResolution";
import GameOver from "./components/GameOver";
import "./index.css";

const GameContent = () => {
  const { phase } = useGame();

  const renderPhase = () => {
    switch (phase) {
      case "setup":
        return <GameSetup />;
      case "roleReveal":
        return <RoleReveal />;
      case "night":
        return <NightPhase />;
      case "resolution":
        return <Resolution />;
      case "voting":
        return <VotingPhase />;
      case "voteResolution":
        return <VoteResolution />;
      case "gameOver":
        return <GameOver />;
      default:
        return <GameSetup />;
    }
  };

  return <>{renderPhase()}</>;
};

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
