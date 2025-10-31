import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export function useWebSocket(serverUrl = import.meta.env.VITE_SOCKET_URL) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomCode, setRoomCode] = useState(null);
  const [gameState, setGameState] = useState('matchmaking'); // matchmaking, lobby, pairing, texting, etc.
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [pairInfo, setPairInfo] = useState(null);
  const [pairs, setPairs] = useState([]);
  const [results, setResults] = useState(null);
  const [votes, setVotes] = useState({ playAgainVotes: 0, menuVotes: 0, total: 0 });

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io(serverUrl);

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to server');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    });

    // ==================== LOBBY EVENTS ====================

    socketRef.current.on('room_created', ({ roomCode, player, isHost }) => {
      setRoomCode(roomCode);
      setCurrentPlayer({ ...player, isHost });
      setPlayers([player]);
      setGameState('lobby');
    });

    socketRef.current.on('room_joined', ({ roomCode, players, isHost }) => {
      setRoomCode(roomCode);
      setPlayers(players);
      setCurrentPlayer(players.find(p => p.id === socketRef.current.id));
      setGameState('lobby');
    });

    socketRef.current.on('player_joined', ({ player }) => {
      setPlayers(prev => [...prev, player]);
    });

    socketRef.current.on('player_left', ({ playerId }) => {
      setPlayers(prev => prev.filter(p => p.id !== playerId));
    });

    socketRef.current.on('player_ready_update', ({ playerId, isReady }) => {
      setPlayers(prev => prev.map(p => 
        p.id === playerId ? { ...p, isReady } : p
      ));
    });

    socketRef.current.on('game_starting', () => {
      console.log('🎮 Game starting...');
    });

    // ==================== PAIRING EVENTS ====================

    socketRef.current.on('pairs_created', (data) => {
      setGameState('pairing');
      setPairInfo(data);
      
      if (!data.isSpectator) {
        // Regular player
        setTimeout(() => {
          setGameState('texting');
        }, 3000);
      } else {
        // Spectator
        setPairs(data.pairs);
        setTimeout(() => {
          setGameState('texting'); // Spectators watch during texting
        }, 3000);
      }
    });

    socketRef.current.on('phase_change', ({ phase, duration }) => {
      setGameState(phase);
      if (duration) {
        setTimeLeft(duration);
      }
    });

    // ==================== TEXTING EVENTS ====================

    socketRef.current.on('message_received', ({ message, isFromPartner }) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('partner_typing', ({ isTyping }) => {
      setPartnerTyping(isTyping);
    });

    socketRef.current.on('timer_update', ({ timeLeft }) => {
      setTimeLeft(timeLeft);
    });

    socketRef.current.on('texting_ended', () => {
      console.log('⏰ Texting phase ended');
    });

    // ==================== PREDICTION EVENTS ====================

    socketRef.current.on('prediction_submitted', ({ totalSubmitted, totalPlayers }) => {
      console.log(`📊 ${totalSubmitted}/${totalPlayers} predictions submitted`);
    });

    socketRef.current.on('all_predictions_done', ({ pairs }) => {
      setGameState('spectating');
      setPairs(pairs);
    });

    // ==================== RESULTS EVENTS ====================

    socketRef.current.on('results_ready', (data) => {
      setGameState('results');
      setResults(data);
    });

    // ==================== POST-GAME EVENTS ====================

    socketRef.current.on('vote_update', (voteData) => {
      setVotes(voteData);
    });

    socketRef.current.on('game_restarting', () => {
      console.log('🔄 Game restarting...');
      // Reset game state
      setMessages([]);
      setPairInfo(null);
      setPairs([]);
      setResults(null);
      setVotes({ playAgainVotes: 0, menuVotes: 0, total: 0 });
    });

    socketRef.current.on('returning_to_lobby', () => {
      console.log('🏠 Returning to lobby...');
      setGameState('lobby');
      setMessages([]);
      setPairInfo(null);
      setPairs([]);
      setResults(null);
      setVotes({ playAgainVotes: 0, menuVotes: 0, total: 0 });
    });

    // ==================== ERROR EVENTS ====================

    socketRef.current.on('error', ({ message }) => {
      console.error('❌ Error:', message);
      alert(message);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [serverUrl]);

  // ==================== ACTION FUNCTIONS ====================

  const createRoom = (username, bubbleColor, matchType) => {
    socketRef.current.emit('create_room', { username, bubbleColor, matchType });
  };

  const joinRoom = (username, bubbleColor, roomCode) => {
    socketRef.current.emit('join_room', { username, bubbleColor, roomCode });
  };

  const findPublicMatch = (username, bubbleColor) => {
    socketRef.current.emit('find_public_match', { username, bubbleColor });
  };

  const toggleReady = () => {
    socketRef.current.emit('toggle_ready', { roomCode });
  };

  const startGame = () => {
    socketRef.current.emit('start_game', { roomCode });
  };

  const sendMessage = (text) => {
    socketRef.current.emit('send_message', { roomCode, text });
  };

  const startTyping = () => {
    socketRef.current.emit('typing_start', { roomCode });
  };

  const stopTyping = () => {
    socketRef.current.emit('typing_stop', { roomCode });
  };

  const submitPrediction = (guessedPartnerId) => {
    socketRef.current.emit('submit_prediction', { roomCode, guessedPartnerId });
  };

  const submitSpectatorGuesses = (guesses) => {
    socketRef.current.emit('submit_spectator_guesses', { roomCode, guesses });
  };

  const skipSpectating = () => {
    socketRef.current.emit('skip_spectating', { roomCode });
  };

  const finishSpectating = () => {
    socketRef.current.emit('finish_spectating', { roomCode });
  };

  const votePlayAgain = () => {
    socketRef.current.emit('vote_play_again', { roomCode });
  };

  const voteReturnToMenu = () => {
    socketRef.current.emit('vote_menu', { roomCode });
  };

  return {
    // Connection state
    isConnected,
    roomCode,
    gameState,
    
    // Player data
    players,
    currentPlayer,
    
    // Texting phase
    messages,
    partnerTyping,
    timeLeft,
    pairInfo,
    
    // Spectator phase
    pairs,
    
    // Results
    results,
    
    // Post-game
    votes,
    
    // Actions
    createRoom,
    joinRoom,
    findPublicMatch,
    toggleReady,
    startGame,
    sendMessage,
    startTyping,
    stopTyping,
    submitPrediction,
    submitSpectatorGuesses,
    skipSpectating,
    finishSpectating,
    votePlayAgain,
    voteReturnToMenu,
  };
}