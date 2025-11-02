import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Stack, Text, Heading, Button, TextBubble } from "../../lib";
import { useTheme } from "../../contexts/ThemeContext";
import { getBubbleAvatarStyle, getBubbleEmoji } from "../../utils/bubbleColors";

export default function PredictionScreen({
  messages = [],
  players = [],
  currentPlayerId,
  anonymousPartnerName = "Player B",
  onSubmitPrediction,
  predictionsSubmitted = 0,
  totalPlayers = 4,
  hasSubmitted = false,
}) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLocked, setIsLocked] = useState(hasSubmitted);
  const { theme } = useTheme();

  // Filter out current player from selection
  const availablePlayers = players.filter((p) => p.id !== currentPlayerId);

  const handleSelectPlayer = (playerId) => {
    if (isLocked) return;
    setSelectedPlayerId(playerId);
  };

  const handleConfirm = () => {
    if (!selectedPlayerId) return;
    setShowConfirm(true);
  };

  const handleSubmit = () => {
    setIsLocked(true);
    onSubmitPrediction?.(selectedPlayerId);
    setShowConfirm(false);
  };

  const selectedPlayer = availablePlayers.find((p) => p.id === selectedPlayerId);

  return (
    <Container
      className={`min-h-screen overflow-y-auto bg-gray-${theme === "dark" ? "900" : "50"
        }`}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`border-b shadow-sm sticky top-0 z-10 px-4 py-4 bg-gray-${theme === "dark" ? "800" : "white"
          } border-gray-${theme === "dark" ? "700" : "200"}`}
      >
        <div className="max-w-4xl mx-auto">
          <Heading
            level={2}
            className={`text-center mb-1 text-${theme === "dark" ? "white" : "black"}`}
          >
            🔮 Who Were You Texting?
          </Heading>
          <Text
            className={`text-sm text-center opacity-70 text-${theme === "dark" ? "white" : "black"}`}
          >
            Review your conversation and make your guess
          </Text>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Stack gap={6}>
          {/* Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 bg-blue-500/${theme === "dark" ? "20" : "10"
              }`}
          >
            <div className="flex items-center justify-between">
              <Text className={`text-sm text-${theme === "dark" ? "white" : "black"}`}>
                <strong>Your Partner:</strong> {anonymousPartnerName}
              </Text>
              <div className="flex items-center gap-2">
                {isLocked ? (
                  <span className="text-green-500 text-sm font-bold">✓ Submitted!</span>
                ) : (
                  <Text
                    className={`text-sm opacity-70 text-${theme === "dark" ? "white" : "black"}`}
                  >
                    {predictionsSubmitted}/{totalPlayers} players done
                  </Text>
                )}
              </div>
            </div>
          </motion.div>

          {/* Conversation Recap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Heading
              level={3}
              className={`mb-3 text-lg text-${theme === "dark" ? "white" : "black"}`}
            >
              📝 Conversation Recap
            </Heading>
            <div
              className={`rounded-xl p-4 max-h-64 overflow-y-auto border bg-gray-${theme === "dark" ? "800" : "white"
                } border-gray-${theme === "dark" ? "700" : "200"}`}
            >
              <Stack gap={2}>
                {messages.length === 0 ? (
                  <Text
                    className={`text-sm opacity-50 text-center py-4 text-${theme === "dark" ? "white" : "black"}`}
                  >
                    No messages were sent
                  </Text>
                ) : (
                  messages.map((msg, index) => {
                    const isCurrentPlayer = msg.playerId === currentPlayerId;
                    return (
                      <motion.div
                        key={msg.id || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TextBubble
                          side={isCurrentPlayer ? "right" : "left"}
                          color={isCurrentPlayer ? "blue" : "gray"}
                        >
                          {msg.text}
                        </TextBubble>
                      </motion.div>
                    );
                  })
                )}
              </Stack>
            </div>
          </motion.div>

          {/* Player Selection Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Heading
              level={3}
              className={`mb-3 text-lg text-${theme === "dark" ? "white" : "black"}`}
            >
              👥 Select a Player
            </Heading>

            {isLocked ? (
              <div
                className={`rounded-xl p-6 text-center border border-green-500/40 bg-green-500/${theme === "dark" ? "20" : "10"
                  }`}
              >
                <div className="text-4xl mb-2">✓</div>
                <Text
                  className={`font-bold mb-1 text-${theme === "dark" ? "white" : "black"}`}
                >
                  Prediction Locked In!
                </Text>
                <Text
                  className={`text-sm opacity-70 text-${theme === "dark" ? "white" : "black"}`}
                >
                  You guessed: <strong>{selectedPlayer?.name}</strong>
                </Text>
                <div className="mt-4">
                  <Text
                    className={`text-xs opacity-60 text-${theme === "dark" ? "white" : "black"}`}
                  >
                    Waiting for other players... ({predictionsSubmitted}/{totalPlayers})
                  </Text>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {availablePlayers.map((player, index) => (
                  <motion.button
                    key={player.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectPlayer(player.id)}
                    className={`p-4 rounded-xl border-2 transition ${selectedPlayerId === player.id
                      ? "border-blue-500 bg-blue-500/20 dark:bg-blue-500/30"
                      : `border-gray-${theme === "dark" ? "600" : "300"} bg-gray-${theme === "dark" ? "800" : "white"
                      } hover:border-blue-400`
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex-shrink-0 relative ${getBubbleAvatarStyle(player.bubbleColor)}`}
                      >
                        {getBubbleEmoji(player.bubbleColor) && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs">
                            {getBubbleEmoji(player.bubbleColor)}
                          </div>
                        )}
                      </div>
                      <div className="text-left flex-1">
                        <Text
                          className={`text-sm font-bold text-${theme === "dark" ? "white" : "black"}`}
                        >
                          {player.name}
                        </Text>
                        {selectedPlayerId === player.id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Text className="text-xs text-blue-600 dark:text-blue-400">
                              Selected ✓
                            </Text>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Confirm Button */}
          {!isLocked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={handleConfirm}
                disabled={!selectedPlayerId}
                size="lg"
                className="w-full py-4"
              >
                {selectedPlayerId
                  ? `Confirm: ${selectedPlayer?.name} is ${anonymousPartnerName}`
                  : "Select a player to continue"}
              </Button>

              {selectedPlayerId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3"
                >
                  <Text
                    className={`text-xs text-center opacity-70 text-${theme === "dark" ? "white" : "black"}`}
                  >
                    ⚠️ You can't change your answer after submitting!
                  </Text>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Tip */}
          {!isLocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`rounded-xl p-4 bg-yellow-500/${theme === "dark" ? "20" : "10"
                }`}
            >
              <Text
                className={`text-xs text-${theme === "dark" ? "white" : "black"}`}
              >
                <strong>💡 Look for clues:</strong> Typing style, emoji usage,
                punctuation, slang, response timing...
              </Text>
            </motion.div>
          )}
        </Stack>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div
                className={`rounded-2xl p-6 max-w-md w-full shadow-2xl bg-gray-${theme === "dark" ? "800" : "white"
                  }`}
              >
                <Heading
                  level={3}
                  className={`mb-4 text-center text-${theme === "dark" ? "white" : "black"}`}
                >
                  Confirm Your Guess?
                </Heading>

                <div
                  className={`rounded-xl p-4 mb-6 bg-blue-500/${theme === "dark" ? "20" : "10"
                    }`}
                >
                  <Text
                    className={`text-center mb-2 text-${theme === "dark" ? "white" : "black"}`}
                  >
                    You think <strong>{anonymousPartnerName}</strong> is:
                  </Text>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <div
                      className={`w-10 h-10 rounded-full relative ${getBubbleAvatarStyle(selectedPlayer?.bubbleColor)}`}
                    >
                      {getBubbleEmoji(selectedPlayer?.bubbleColor) && (
                        <div className="absolute inset-0 flex items-center justify-center text-lg">
                          {getBubbleEmoji(selectedPlayer?.bubbleColor)}
                        </div>
                      )}
                    </div>
                    <Heading
                      level={3}
                      className={`text-${theme === "dark" ? "white" : "black"}`}
                    >
                      {selectedPlayer?.name}
                    </Heading>
                  </div>
                </div>

                <Text
                  className={`text-xs text-center mb-6 opacity-70 text-${theme === "dark" ? "white" : "black"}`}
                >
                  This will be your final answer. You'll earn{" "}
                  <strong className="text-green-500">+10 points</strong> if correct!
                </Text>

                <div className="flex gap-3">
                  <Button onClick={() => setShowConfirm(false)} variant="ghost" className="flex-1">
                    Go Back
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1">
                    Lock It In! 🔒
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Container>
  );
}
