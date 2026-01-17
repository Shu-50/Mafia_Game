import { useState } from "react";
import { GameProvider, useGame } from "./context/GameContext";
import { MultiplayerProvider } from "./context/MultiplayerContext";
import GameSetup from "./components/GameSetup";
import RoleReveal from "./components/RoleReveal";
import NightPhase from "./components/NightPhase";
import Resolution from "./components/Resolution";
import VotingPhase from "./components/VotingPhase";
import VoteResolution from "./components/VoteResolution";
import GameOver from "./components/GameOver";
import ModeSelection from "./components/ModeSelection";
import OnlineModeSelector from "./components/online/OnlineModeSelector";
import CreateRoom from "./components/online/CreateRoom";
import JoinRoom from "./components/online/JoinRoom";
import Lobby from "./components/online/Lobby";
import OnlineGame from "./components/online/OnlineGame";
import "./index.css";

// Offline game content
const OfflineGameContent = () => {
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

// Main app with mode selection
function App() {
  const [mode, setMode] = useState(null); // null, 'offline', 'online'
  const [onlineScreen, setOnlineScreen] = useState("selector"); // selector, create, join, lobby, game

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === "online") {
      setOnlineScreen("selector");
    }
  };

  const handleBackToModeSelection = () => {
    setMode(null);
    setOnlineScreen("selector");
  };

  const handleBackToOnlineSelector = () => {
    setOnlineScreen("selector");
  };

  const handleRoomCreated = () => {
    setOnlineScreen("lobby");
  };

  const handleRoomJoined = () => {
    setOnlineScreen("lobby");
  };

  const handleStartGame = () => {
    setOnlineScreen("game");
  };

  const handleReturnToLobby = () => {
    setOnlineScreen("lobby");
  };

  // Render based on mode
  if (mode === null) {
    return <ModeSelection onSelectMode={handleModeSelect} />;
  }

  if (mode === "offline") {
    return (
      <GameProvider>
        <OfflineGameContent />
      </GameProvider>
    );
  }

  if (mode === "online") {
    return (
      <MultiplayerProvider>
        {onlineScreen === "selector" && (
          <OnlineModeSelector
            onCreateRoom={() => setOnlineScreen("create")}
            onJoinRoom={() => setOnlineScreen("join")}
            onBack={handleBackToModeSelection}
          />
        )}
        {onlineScreen === "create" && (
          <CreateRoom
            onRoomCreated={handleRoomCreated}
            onBack={handleBackToOnlineSelector}
          />
        )}
        {onlineScreen === "join" && (
          <JoinRoom
            onRoomJoined={handleRoomJoined}
            onBack={handleBackToOnlineSelector}
          />
        )}
        {onlineScreen === "lobby" && <Lobby onStartGame={handleStartGame} />}
        {onlineScreen === "game" && (
          <OnlineGame onReturnToLobby={handleReturnToLobby} />
        )}
      </MultiplayerProvider>
    );
  }

  return null;
}

export default App;
