import { useState } from "react";
import { motion } from "framer-motion";
import { Container, Stack, Button, Text, Heading } from "../../lib";

export default function Lobby({
  roomCode,
  players,
  currentPlayer,
  isHost,
  onStartGame,
  onLeaveRoom,
  onToggleReady,
}) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const readyCount = players.filter((p) => p.isReady).length;
  const canStart = players.length >= 2 && (isHost ? readyCount === players.length : false);

  return (
    <Container className="min-h-screen justify-center py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Stack gap={6} className="px-4">
          {/* Header */}
          <div className="text-center">
            <Heading level={2} className="mb-2">
              🎮 Game Lobby
            </Heading>
            <Text className="text-sm opacity-70">
              Waiting for players to join...
            </Text>
          </div>

          {/* Room Code Display */}
          {roomCode && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-blue-500/10 dark:bg-blue-500/20 rounded-xl p-4"
            >
              <Text className="text-xs opacity-70 text-center mb-2">
                Room Code
              </Text>
              <div className="flex items-center justify-center gap-3">
                <Heading
                  level={3}
                  className="font-mono tracking-widest text-center"
                >
                  {roomCode}
                </Heading>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyCode}
                  className="text-xs"
                >
                  {copySuccess ? "✓ Copied!" : "📋 Copy"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Player List */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Text className="text-sm font-bold opacity-70">
                Players ({players.length})
              </Text>
              <Text className="text-xs opacity-50">
                {readyCount}/{players.length} ready
              </Text>
            </div>

            <Stack gap={2}>
              {players.map((player, i) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg transition ${
                    player.id === currentPlayer?.id
                      ? "bg-blue-500/20 border border-blue-500/40"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Bubble Color Preview */}
                    <div
                      className={`w-6 h-6 rounded-full ${
                        player.bubbleColor === "blue"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                    />
                    <div>
                      <Text className="text-sm font-medium">
                        {player.name}
                        {player.id === currentPlayer?.id && " (You)"}
                        {player.isHost && " 👑"}
                      </Text>
                    </div>
                  </div>

                  {/* Ready Status */}
                  <div className="flex items-center gap-2">
                    {player.isReady ? (
                      <span className="text-green-500 text-lg">✓</span>
                    ) : (
                      <span className="text-gray-400 text-xs">Not ready</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </Stack>
          </div>

          {/* Game Info */}
          <div className="bg-yellow-500/10 dark:bg-yellow-500/20 rounded-xl p-4">
            <Text className="text-xs">
              <strong>💡 How to play:</strong> You'll be paired anonymously with
              another player. Chat for 3 minutes, then guess who you were
              texting!
            </Text>
          </div>

          {/* Ready Toggle Button (Non-Host) */}
          {!isHost && (
            <Button
              onClick={onToggleReady}
              size="lg"
              className="w-full py-4"
              variant={currentPlayer?.isReady ? "outline" : "primary"}
            >
              {currentPlayer?.isReady ? "✓ Ready!" : "Mark as Ready"}
            </Button>
          )}

          {/* Start Game Button (Host Only) */}
          {isHost && (
            <Button
              onClick={onStartGame}
              size="lg"
              className="w-full py-4"
              disabled={!canStart}
            >
              {players.length < 2
                ? "Need at least 2 players"
                : !canStart
                ? `Waiting for players... (${readyCount}/${players.length})`
                : "🚀 Start Game"}
            </Button>
          )}

          {/* Leave Room */}
          <Button
            onClick={onLeaveRoom}
            variant="ghost"
            size="md"
            className="w-full"
          >
            Leave Room
          </Button>

          {/* Player Count Warning */}
          {players.length % 2 === 1 && players.length > 1 && (
            <div className="bg-orange-500/10 dark:bg-orange-500/20 rounded-xl p-3">
              <Text className="text-xs text-center">
                ⚠️ Odd number of players! One player will spectate this round.
              </Text>
            </div>
          )}
        </Stack>
      </motion.div>
    </Container>
  );
}