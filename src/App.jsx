import { useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';

// Import all game screens
import MatchmakingScreen from './components/game/MatchmakingScreen';
import Lobby from './components/game/Lobby';
import PairingScreen from './components/game/PairingScreen';
import TextingSession from './components/game/TextingSession';
import PredictionScreen from './components/game/PredictionScreen';
import SpectatorMode from './components/game/SpectatorMode';
import ResultsScreen from './components/game/ResultsScreen';
import PostGameScreen from './components/game/PostGameScreen';

export default function App() {
  const {
    // State
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
  } = useWebSocket();

  // Show connection status
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔌</div>
          <h2 className="text-2xl font-bold mb-2">Connecting to server...</h2>
          <p className="text-gray-500">Please wait</p>
        </div>
      </div>
    );
  }

  // Render based on game state
  switch (gameState) {
    case 'matchmaking':
      return (
        <MatchmakingScreen
          onCreateMatch={({ username, bubbleColor, matchType }) => {
            createRoom(username, bubbleColor, matchType);
          }}
          onJoinMatch={({ username, bubbleColor, roomCode }) => {
            joinRoom(username, bubbleColor, roomCode);
          }}
          onFindPublicMatch={({ username, bubbleColor }) => {
            findPublicMatch(username, bubbleColor);
          }}
        />
      );

    case 'lobby':
      return (
        <Lobby
          roomCode={roomCode}
          players={players}
          currentPlayer={currentPlayer}
          isHost={currentPlayer?.isHost}
          onStartGame={startGame}
          onLeaveRoom={() => window.location.reload()}
          onToggleReady={toggleReady}
        />
      );

    case 'pairing':
      return (
        <PairingScreen
          playerCount={players.length}
          isSpectator={pairInfo?.isSpectator}
          onPairingComplete={() => {
            // Automatically handled by WebSocket
          }}
        />
      );

    case 'texting':
      if (pairInfo?.isSpectator) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">👀</div>
              <h2 className="text-2xl font-bold">You're Spectating</h2>
              <p className="text-gray-500">Watch the timer...</p>
            </div>
          </div>
        );
      }
      
      return (
        <TextingSession
          anonymousPartnerName={pairInfo?.anonymousName || 'Partner'}
          messages={messages}
          currentPlayerId={currentPlayer?.id}
          timeLeft={timeLeft}
          onSendMessage={sendMessage}
          onTypingStart={startTyping}
          onTypingStop={stopTyping}
          partnerTyping={partnerTyping}
          playerNames={players.map(p => p.name)}
          bubbleColor={currentPlayer?.bubbleColor}
        />
      );

    case 'predicting':
      return (
        <PredictionScreen
          messages={messages}
          players={players}
          currentPlayerId={currentPlayer?.id}
          anonymousPartnerName={pairInfo?.anonymousName}
          onSubmitPrediction={submitPrediction}
          predictionsSubmitted={0} // You can track this
          totalPlayers={players.length}
          hasSubmitted={false} // Track locally
        />
      );

    case 'spectating':
      return (
        <SpectatorMode
          pairs={pairs}
          players={players}
          currentPlayerId={currentPlayer?.id}
          onSubmitGuesses={submitSpectatorGuesses}
          onSkip={() => {
            skipSpectating();
            finishSpectating();
          }}
        />
      );

    case 'results':
      return (
        <ResultsScreen
          pairs={results?.pairs || []}
          players={players}
          predictions={results?.predictions || {}}
          spectatorGuesses={results?.spectatorGuesses || {}}
          onContinue={() => {
            // Move to post-game
          }}
        />
      );

    case 'post-game':
      const winner = players.reduce((max, p) => 
        (results?.scores[p.id]?.total || 0) > (results?.scores[max?.id]?.total || 0) ? p : max
      , players[0]);
      
      return (
        <PostGameScreen
          players={players}
          currentPlayerId={currentPlayer?.id}
          winner={winner}
          finalScores={results?.scores || {}}
          onPlayAgain={votePlayAgain}
          onReturnToMenu={voteReturnToMenu}
        />
      );

    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <h2 className="text-2xl">Loading...</h2>
        </div>
      );
  }
}