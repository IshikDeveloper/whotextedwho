import { useState } from "react";
import { motion } from "framer-motion";
import { Container, Stack, Button, Text, Heading } from "../../lib";
import { useTheme } from "../../contexts/ThemeContext";
import { getBubbleAvatarStyle, getBubbleEmoji } from "../../utils/bubbleColors";

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

  // ✅ Safe theme extraction
  const { theme } = useTheme() || { theme: "light" };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const readyCount = players.filter((p) => p.isReady).length;
  const allReady = players.length >= 2 && readyCount === players.length;
  const canStart = isHost && allReady;

  // Get bubble preview style based on color theme

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <Container
        className={`min-h-screen min-w-screen justify-center py-8 transition-colors duration-300 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"
          }`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Stack gap={6} className="px-4 transition-colors">
            {/* Header */}
            <div className={theme === "dark" ? "text-gray-100" : "text-gray-900"}>
              <Heading level={2} className="mb-2 text-center">
                🎮 Game Lobby
              </Heading>
              <Text className="text-sm opacity-70 text-center">
                Waiting for players to join...
              </Text>
            </div>

            {/* Room Code Display */}
            {roomCode && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className={`rounded-xl p-4 ${theme === "dark" ? "bg-blue-500/20" : "bg-blue-500/10"
                  }`}
              >
                <Text className={`text-xs opacity-70 text-center mb-2 ${theme === "dark" ? "text-white" : "text-gray-700"}`}>
                  Room Code
                </Text>
                <div className="flex items-center justify-center gap-3">
                  <Heading level={3} className={`font-mono tracking-widest text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {roomCode}
                  </Heading>
                  <Button
                    variant="ghost"
                    size="sm"
                    theme={theme}
                    onClick={handleCopyCode}
                    className="text-xs"
                  >
                    {copySuccess ? "✓ Copied!" : "📋 Copy"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Player List */}
            <div
              className={`rounded-xl p-4 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"
                }`}
            >
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
                    key={player.id || i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg transition ${player.id === currentPlayer?.id
                      ? "bg-blue-500/20 border border-blue-500/40"
                      : theme === "dark"
                        ? "bg-gray-700"
                        : "bg-gray-200"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex-shrink-0 relative ${getBubbleAvatarStyle(player.bubbleColor)}`}
                      >
                        {getBubbleEmoji(player.bubbleColor) && (
                          <div className="absolute inset-0 flex items-center justify-center text-[6px]">
                            {getBubbleEmoji(player.bubbleColor)}
                          </div>
                        )}
                      </div>
                      <Text className="text-sm font-medium">
                        {player.name}
                        {player.id === currentPlayer?.id && " (You)"}
                        {player.isHost && " 👑"}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2">
                      {player.isReady ? (
                        <span className="text-green-500 text-lg">✓</span>
                      ) : (
                        <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                          Not ready
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </Stack>
            </div>

            {/* Game Info */}
            <div
              className={`rounded-xl p-4 ${theme === "dark" ? "bg-yellow-500/20" : "bg-yellow-500/10"
                }`}
            >
              <Text className={`text-xs ${theme === "dark" ? "text-yellow-100" : "text-yellow-900"}`}>
                <strong>💡 How to play:</strong> You'll be paired anonymously with
                another player. Chat for 3 minutes, then guess who you were
                texting!
              </Text>
            </div>

            {/* Ready/Start Button */}
            {players.length < 2 ? (
              <Button
                theme={theme}
                size="lg"
                className="w-full py-4"
                disabled
              >
                Waiting for players... ({players.length}/2)
              </Button>
            ) : canStart ? (
              <Button
                onClick={onStartGame}
                theme={theme}
                size="lg"
                className="w-full py-4"
              >
                🚀 Start Game
              </Button>
            ) : (
              <Button
                onClick={onToggleReady}
                theme={theme}
                size="lg"
                className="w-full py-4"
                variant={currentPlayer?.isReady ? "outline" : "primary"}
              >
                {currentPlayer?.isReady ? "✓ Ready!" : "Mark as Ready"}
              </Button>
            )}

            {/* Leave Room */}
            <Button
              onClick={onLeaveRoom}
              variant="ghost"
              theme={theme}
              size="md"
              className="w-full"
            >
              Leave Room
            </Button>

            {/* Odd Player Warning */}
            {players.length % 2 === 1 && players.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-3 ${theme === "dark" ? "bg-orange-500/20" : "bg-orange-500/10"
                  }`}
              >
                <Text className={`text-xs text-center ${theme === "dark" ? "text-orange-100" : "text-orange-900"}`}>
                  ⚠️ Odd number of players! One player will spectate this round.
                </Text>
              </motion.div>
            )}
          </Stack>
        </motion.div>
      </Container>
    </div>
  );
}