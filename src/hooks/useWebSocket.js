// ============================================
// FILE: src/hooks/useWebSocket.js
// ============================================

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export function useWebSocket(serverUrl = import.meta.env.VITE_SOCKET_URL) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomCode, setRoomCode] = useState(null);
  const [gameState, setGameState] = useState('matchmaking');
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
      console.log('🏠 Room created:', { player, bubbleColor: player.bubbleColor });
      setRoomCode(roomCode);
      setCurrentPlayer({ ...player, isHost });
      setPlayers([player]);
      setGameState('lobby');
    });

    socketRef.current.on('room_joined', ({ roomCode, players, isHost }) => {
      console.log('🚪 Room joined:', { players });
      setRoomCode(roomCode);
      setPlayers(players);
      const me = players.find(p => p.id === socketRef.current.id);
      console.log('👤 Current player:', me);
      setCurrentPlayer(me);
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
        setTimeout(() => {
          setGameState('texting');
        }, 3000);
      } else {
        setPairs(data.pairs);
        setTimeout(() => {
          setGameState('texting');
        }, 3000);
      }

// ============================================
// FILE: src/components/game/TextingSession.jsx
// CHECK THE RENDERING SECTION
// ============================================

// In your TextingSession.jsx, make sure this section looks like this:

// ============================================
// DEBUGGING CHECKLIST
// ============================================

/*
1. Check browser console for these logs:
   - "🎨 Creating room with bubble color: [color]"
   - "👤 Current player: { bubbleColor: '...' }"
   - "💬 Sending message: { bubbleColor: '...' }"
   - "📨 Message received: { bubbleColor: '...' }"
   - "🎨 Rendering bubble: { bubbleColor: '...' }"

2. If you see "bubbleColor: undefined" anywhere, that's the issue

3. Check your backend - does it:
   a) Store bubbleColor when player joins?
   b) Include bubbleColor in message broadcasts?
   c) Log the message object before sending?

4. Common issues:
   - Backend not saving bubbleColor to player object
   - Backend not including bubbleColor in message object
   - Message structure mismatch between frontend/backend
*/
    });

    socketRef.current.on('phase_change', ({ phase, duration }) => {
      setGameState(phase);
      if (duration) {
        setTimeLeft(duration);
      }
    });

    // ==================== TEXTING EVENTS ====================

    socketRef.current.on('message_received', ({ message, isFromPartner }) => {
      console.log('📨 Message received:', message); // DEBUG
      console.log('   - Text:', message.text);
      console.log('   - BubbleColor:', message.bubbleColor);
      console.log('   - PlayerId:', message.playerId);
      
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

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [serverUrl]);

  // ==================== ACTION FUNCTIONS ====================

  const createRoom = (username, bubbleColor, matchType) => {
    console.log('🎨 Creating room with bubble color:', bubbleColor);
    socketRef.current.emit('create_room', { username, bubbleColor, matchType });
  };

  const joinRoom = (username, bubbleColor, roomCode) => {
    console.log('🎨 Joining room with bubble color:', bubbleColor);
    socketRef.current.emit('join_room', { username, bubbleColor, roomCode });
  };

  const findPublicMatch = (username, bubbleColor) => {
    console.log('🎨 Finding public match with bubble color:', bubbleColor);
    socketRef.current.emit('find_public_match', { username, bubbleColor });
  };

  const toggleReady = () => {
    socketRef.current.emit('toggle_ready', { roomCode });
  };

  const startGame = () => {
    socketRef.current.emit('start_game', { roomCode });
  };

  const sendMessage = (text, bubbleColor) => {
    // ✅ CRITICAL: Get bubble color from current player
    
    console.log('💬 Sending message:', {
      text,
      bubbleColor,
      currentPlayer: currentPlayer?.name,
      playerId: currentPlayer?.id
    });
    
    socketRef.current.emit('send_message', { 
      roomCode, 
      text,
      bubbleColor // Include bubble color in the payload
    });
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
    isConnected,
    roomCode,
    gameState,
    players,
    currentPlayer,
    messages,
    partnerTyping,
    timeLeft,
    pairInfo,
    pairs,
    results,
    votes,
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