import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stack, Text, Heading, Button, TextBubble } from "../../lib";

export default function SpectatorMode({
  pairs = [],
  players = [],
  currentPlayerId,
  onSubmitGuesses,
  onSkip,
}) {
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const [guesses, setGuesses] = useState({}); // { pairId: { player1Id, player2Id } }
  const [showConfirm, setShowConfirm] = useState(false);

  const currentPair = pairs[selectedPairIndex];
  const hasGuessedCurrentPair = guesses[currentPair?.id];

  // Get available players (exclude current user and already guessed)
  const getAvailablePlayersForSlot = (slotNumber) => {
    const currentGuesses = guesses[currentPair?.id] || {};
    const otherSlotGuess =
      slotNumber === 1 ? currentGuesses.player2Id : currentGuesses.player1Id;

    return players.filter(
      (p) => p.id !== currentPlayerId && p.id !== otherSlotGuess
    );
  };

  const handleSelectPlayer = (slotNumber, playerId) => {
    setGuesses((prev) => ({
      ...prev,
      [currentPair.id]: {
        ...prev[currentPair.id],
        [`player${slotNumber}Id`]: playerId,
      },
    }));
  };

  const handleNextPair = () => {
    if (selectedPairIndex < pairs.length - 1) {
      setSelectedPairIndex((prev) => prev + 1);
    }
  };

  const handlePrevPair = () => {
    if (selectedPairIndex > 0) {
      setSelectedPairIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Check if all pairs have guesses
    const allGuessed = pairs.every((pair) => {
      const guess = guesses[pair.id];
      return guess?.player1Id && guess?.player2Id;
    });

    if (allGuessed) {
      setShowConfirm(true);
    }
  };

  const confirmSubmit = () => {
    onSubmitGuesses?.(guesses);
    setShowConfirm(false);
  };

  const guessedPairs = Object.keys(guesses).filter((pairId) => {
    const guess = guesses[pairId];
    return guess?.player1Id && guess?.player2Id;
  }).length;

  const totalPoints = guessedPairs * 5;

  if (!currentPair) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Text>No pairs to spectate</Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 shadow-sm sticky top-0 z-10"
      >
        <div className="max-w-4xl mx-auto">
          <Heading level={2} className="text-center mb-1">
            👀 Spectator Mode
          </Heading>
          <Text className="text-sm text-center opacity-70">
            Watch conversations and predict both players
          </Text>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Stack gap={6}>
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-500/10 dark:bg-blue-500/20 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Text className="text-sm">
                <strong>Pair {selectedPairIndex + 1}</strong> of {pairs.length}
              </Text>
              <Text className="text-sm opacity-70">
                {guessedPairs}/{pairs.length} pairs predicted
              </Text>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(guessedPairs / pairs.length) * 100}%`,
                }}
                className="bg-blue-500 h-2 rounded-full transition-all"
              />
            </div>
            <Text className="text-xs text-center mt-2 opacity-70">
              Potential points: <strong className="text-green-500">+{totalPoints}</strong>
            </Text>
          </motion.div>

          {/* Conversation Display */}
          <motion.div
            key={currentPair.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center justify-between mb-3">
              <Heading level={3} className="text-lg">
                💬 Conversation
              </Heading>
              {hasGuessedCurrentPair && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-500 text-sm font-bold"
                >
                  ✓ Predicted
                </motion.span>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700">
              <Stack gap={2}>
                {currentPair.messages.length === 0 ? (
                  <Text className="text-sm opacity-50 text-center py-4">
                    This pair didn't send any messages
                  </Text>
                ) : (
                  currentPair.messages.map((msg, index) => {
                    const isPlayer1 = msg.playerId === currentPair.player1Id;
                    return (
                      <motion.div
                        key={msg.id || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TextBubble
                          side={isPlayer1 ? "left" : "right"}
                          color={isPlayer1 ? "blue" : "green"}
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

          {/* Player Guessing Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Heading level={3} className="mb-3 text-lg">
              🎯 Who Are They?
            </Heading>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Player 1 (Blue bubbles) */}
              <div className="bg-blue-500/10 dark:bg-blue-500/20 rounded-xl p-4 border border-blue-500/40">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full" />
                  <Text className="text-sm font-bold">Blue Bubbles</Text>
                </div>

                <Stack gap={2}>
                  {getAvailablePlayersForSlot(1).map((player) => {
                    const isSelected =
                      guesses[currentPair.id]?.player1Id === player.id;
                    return (
                      <motion.button
                        key={player.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectPlayer(1, player.id)}
                        className={`p-3 rounded-lg border-2 transition text-left ${
                          isSelected
                            ? "border-blue-500 bg-blue-500/20"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded-full ${
                                player.bubbleColor === "blue"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              }`}
                            />
                            <Text className="text-sm font-medium">
                              {player.name}
                            </Text>
                          </div>
                          {isSelected && (
                            <span className="text-blue-500">✓</span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </Stack>
              </div>

              {/* Player 2 (Green bubbles) */}
              <div className="bg-green-500/10 dark:bg-green-500/20 rounded-xl p-4 border border-green-500/40">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full" />
                  <Text className="text-sm font-bold">Green Bubbles</Text>
                </div>

                <Stack gap={2}>
                  {getAvailablePlayersForSlot(2).map((player) => {
                    const isSelected =
                      guesses[currentPair.id]?.player2Id === player.id;
                    return (
                      <motion.button
                        key={player.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectPlayer(2, player.id)}
                        className={`p-3 rounded-lg border-2 transition text-left ${
                          isSelected
                            ? "border-green-500 bg-green-500/20"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded-full ${
                                player.bubbleColor === "blue"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              }`}
                            />
                            <Text className="text-sm font-medium">
                              {player.name}
                            </Text>
                          </div>
                          {isSelected && (
                            <span className="text-green-500">✓</span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </Stack>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handlePrevPair}
              disabled={selectedPairIndex === 0}
              variant="outline"
              className="flex-1"
            >
              ← Previous
            </Button>
            {selectedPairIndex < pairs.length - 1 ? (
              <Button onClick={handleNextPair} className="flex-1">
                Next →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={guessedPairs !== pairs.length}
                className="flex-1"
              >
                Submit All ({guessedPairs}/{pairs.length})
              </Button>
            )}
          </div>

          {/* Skip Option */}
          <Button onClick={onSkip} variant="ghost" className="w-full">
            Skip Spectating (No Bonus Points)
          </Button>

          {/* Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-yellow-500/10 dark:bg-yellow-500/20 rounded-xl p-4"
          >
            <Text className="text-xs">
              <strong>💡 Strategy:</strong> You must predict BOTH players
              correctly to earn +5 points per pair. Pay attention to how each
              person types!
            </Text>
          </motion.div>
        </Stack>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                <Heading level={3} className="mb-4 text-center">
                  Submit Predictions?
                </Heading>

                <div className="bg-blue-500/10 dark:bg-blue-500/20 rounded-xl p-4 mb-4">
                  <Text className="text-center mb-2 text-sm">
                    You've predicted all {pairs.length} pairs!
                  </Text>
                  <Text className="text-center text-2xl font-bold text-green-500">
                    Potential: +{totalPoints} points
                  </Text>
                </div>

                <Text className="text-xs text-center mb-6 opacity-70">
                  You earn +5 points for each pair where you correctly identify
                  BOTH players.
                </Text>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowConfirm(false)}
                    variant="ghost"
                    className="flex-1"
                  >
                    Review
                  </Button>
                  <Button onClick={confirmSubmit} className="flex-1">
                    Lock Predictions 🔒
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}