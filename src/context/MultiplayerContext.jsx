import { createContext, useContext, useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import ShortUniqueId from "short-unique-id";

const MultiplayerContext = createContext();

export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error("useMultiplayer must be used within MultiplayerProvider");
  }
  return context;
};

export const MultiplayerProvider = ({ children }) => {
  const [peer, setPeer] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [myPlayerId, setMyPlayerId] = useState("");
  const [myPlayerName, setMyPlayerName] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStateUpdate, setGameStateUpdate] = useState(null);

  // Game settings (host only)
  const [gameSettings, setGameSettings] = useState({
    showVoteDetails: true,
    nightTimer: false,
    dayTimer: false,
    numMafia: 1, // Currently fixed at 1
  });

  // Peer connections (host only)
  const connectionsRef = useRef({});

  // Track host status with ref to avoid closure issues
  const isHostRef = useRef(false);

  // Create room (become host)
  const createRoom = (playerName) => {
    return new Promise((resolve, reject) => {
      try {
        // Generate room code
        const uid = new ShortUniqueId({ length: 6 });
        const code = uid.rnd().toUpperCase();
        const newPeer = new Peer(code);

        newPeer.on("open", (id) => {
          setRoomCode(code);
          setMyPlayerId(id);
          setMyPlayerName(playerName);
          setIsHost(true);
          isHostRef.current = true; // Update ref
          setIsConnected(true);

          // Add host as first player (automatically ready)
          setPlayers([{ id, name: playerName, isReady: true, isHost: true }]);

          setPeer(newPeer);
          resolve(code);
        });

        newPeer.on("connection", (conn) => {
          handleIncomingConnection(conn);
        });

        newPeer.on("error", (err) => {
          console.error("Peer error:", err);
          setError(err.message);
          reject(err);
        });
      } catch (err) {
        console.error("Create room error:", err);
        setError(err.message);
        reject(err);
      }
    });
  };

  // Join room
  const joinRoom = (code, playerName) => {
    return new Promise((resolve, reject) => {
      try {
        const newPeer = new Peer();

        newPeer.on("open", (id) => {
          setMyPlayerId(id);
          setMyPlayerName(playerName);
          setIsHost(false);

          // Connect to host
          const conn = newPeer.connect(code);

          // Store connection for sending messages to host
          connectionsRef.current[code] = conn;

          conn.on("open", () => {
            console.log("Connection to host opened");
            setRoomCode(code);
            setIsConnected(true);
            setPeer(newPeer);

            // Send join message
            conn.send({
              type: "join",
              playerId: id,
              playerName: playerName,
            });

            resolve();
          });

          conn.on("data", (data) => {
            console.log("Received data from host:", data);
            handleMessage(data, conn);
          });

          conn.on("error", (err) => {
            console.error("Connection error:", err);
            setError("Failed to connect to room");
            reject(err);
          });

          conn.on("close", () => {
            console.log("Connection to host closed");
            setError("Connection to host lost");
          });
        });

        newPeer.on("error", (err) => {
          console.error("Peer error:", err);
          setError(err.message);
          reject(err);
        });
      } catch (err) {
        console.error("Join room error:", err);
        setError(err.message);
        reject(err);
      }
    });
  };

  // Handle incoming connections (host only)
  const handleIncomingConnection = (conn) => {
    console.log("Incoming connection from:", conn.peer);

    conn.on("data", (data) => {
      console.log("Host received data:", data);
      handleMessage(data, conn);
    });

    conn.on("open", () => {
      console.log("Connection opened with:", conn.peer);
      connectionsRef.current[conn.peer] = conn;
    });

    conn.on("close", () => {
      console.log("Connection closed with:", conn.peer);
      handlePlayerDisconnect(conn.peer);
    });
  };

  // Handle messages
  const handleMessage = (data, conn) => {
    switch (data.type) {
      case "join":
        if (isHostRef.current) {
          console.log("Player joining:", data.playerName);

          // Build the new player object
          const newPlayer = {
            id: data.playerId,
            name: data.playerName,
            isReady: false,
            isHost: false,
          };

          // Add new player to state using functional update
          setPlayers((prevPlayers) => {
            const updatedPlayers = [...prevPlayers, newPlayer];

            // Send current player list and settings to new player
            conn.send({
              type: "playerList",
              players: updatedPlayers,
              settings: gameSettings,
            });

            // Broadcast updated player list to all other players
            broadcastToAll({
              type: "playerList",
              players: updatedPlayers,
              settings: gameSettings,
            });

            return updatedPlayers;
          });
        }
        break;

      case "playerList":
        setPlayers(data.players);
        setGameSettings(data.settings);
        break;

      case "ready":
        console.log(
          "Received ready message:",
          data,
          "isHost:",
          isHost,
          "isHostRef:",
          isHostRef.current,
        );
        setPlayers((prev) => {
          const updated = prev.map((p) =>
            p.id === data.playerId ? { ...p, isReady: data.isReady } : p,
          );
          console.log("Updated players after ready:", updated);
          return updated;
        });
        if (isHostRef.current) {
          console.log("Broadcasting ready status to all players");
          broadcastToAll(data);
        } else {
          console.log("Not broadcasting (not host)");
        }
        break;

      case "kick":
        if (data.playerId === myPlayerId) {
          // I was kicked
          leaveRoom();
          setError("You were kicked from the room");
        }
        break;

      case "settingsUpdate":
        setGameSettings(data.settings);
        break;

      case "gameStart":
        console.log("Game starting!");
        setGameStarted(true);
        break;

      case "gameState":
        console.log("Received game state update:", data.state);
        setGameStateUpdate(data.state);
        break;

      default:
        console.log("Unknown message type:", data.type);
    }
  };

  // Broadcast to all connected peers (host only)
  const broadcastToAll = (data) => {
    Object.values(connectionsRef.current).forEach((conn) => {
      if (conn.open) {
        conn.send(data);
      }
    });
  };

  // Toggle ready status
  const toggleReady = () => {
    const newReadyStatus = !players.find((p) => p.id === myPlayerId)?.isReady;

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === myPlayerId ? { ...p, isReady: newReadyStatus } : p,
      ),
    );

    const message = {
      type: "ready",
      playerId: myPlayerId,
      isReady: newReadyStatus,
    };

    if (isHost) {
      broadcastToAll(message);
    } else {
      // Send to host - get the connection by room code
      const hostConn = connectionsRef.current[roomCode];
      if (hostConn?.open) {
        console.log("Sending ready status to host:", message);
        hostConn.send(message);
      } else {
        console.error("No connection to host found");
      }
    }
  };

  // Kick player (host only)
  const kickPlayer = (playerId) => {
    if (!isHost) return;

    // Remove from player list
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));

    // Send kick message
    const conn = connectionsRef.current[playerId];
    if (conn?.open) {
      conn.send({ type: "kick", playerId });
      conn.close();
    }

    delete connectionsRef.current[playerId];

    // Broadcast updated player list
    broadcastToAll({
      type: "playerList",
      players: players.filter((p) => p.id !== playerId),
      settings: gameSettings,
    });
  };

  // Update settings (host only)
  const updateSettings = (newSettings) => {
    if (!isHost) return;

    setGameSettings(newSettings);
    broadcastToAll({
      type: "settingsUpdate",
      settings: newSettings,
    });
  };

  // Handle player disconnect
  const handlePlayerDisconnect = (playerId) => {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    delete connectionsRef.current[playerId];

    if (isHost) {
      broadcastToAll({
        type: "playerList",
        players: players.filter((p) => p.id !== playerId),
        settings: gameSettings,
      });
    }
  };

  // Leave room
  const leaveRoom = () => {
    if (peer) {
      peer.destroy();
    }
    setPeer(null);
    setIsHost(false);
    setRoomCode("");
    setPlayers([]);
    setMyPlayerId("");
    setMyPlayerName("");
    setIsConnected(false);
    connectionsRef.current = {};
  };

  // Start game (host only)
  const startGame = () => {
    if (!isHostRef.current) return;

    setGameStarted(true);
    broadcastToAll({
      type: "gameStart",
    });
  };

  // Broadcast game state (host only)
  const broadcastGameState = (state) => {
    if (!isHost) return;

    broadcastToAll({
      type: "gameState",
      state,
    });
  };

  const value = {
    peer,
    isHost,
    roomCode,
    players,
    myPlayerId,
    myPlayerName,
    isConnected,
    error,
    gameSettings,
    gameStarted,
    gameStateUpdate,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleReady,
    kickPlayer,
    updateSettings,
    startGame,
    broadcastGameState,
  };

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
};
