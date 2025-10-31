import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stack, Text, Heading, Button } from "../../lib";

export default function ResultsScreen({
  pairs = [],
  players = [],
  predictions = {},
  spectatorGuesses = {},
  onContinue,
}) {
  const [revealStage, setRevealStage] = useState(0);
  const [scores, setScores] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);

  // Calculate all scores
  useEffect(() => {
    const newScores = {};
    
    // Initialize all player scores
    players.forEach((player) => {
      newScores[player.id] = {
        partnerGuess: 0,
        spectatorCorrect: 0,
        confusionBonus: 0,
        total: 0,
      };
    });

    // Score partner predictions (+10 if correct)
    Object.entries(predictions).forEach(([playerId, guessedId]) => {
      const playerPair = pairs.find(
        (pair) => pair.player1Id === playerId || pair.player2Id === playerId
      );
      
      if (playerPair) {
        const actualPartnerId =
          playerPair.player1Id === playerId
            ? playerPair.player2Id
            : playerPair.player1Id;
        
        if (guessedId === actualPartnerId) {
          newScores[playerId].partnerGuess = 10;
        }
      }
    });

    // Score spectator guesses (+5 per correct pair)
    Object.entries(spectatorGuesses).forEach(([playerId, pairGuesses]) => {
      let correctPairs = 0;
      
      Object.entries(pairGuesses).forEach(([pairId, guess]) => {
        const pair = pairs.find((p) => p.id === pairId);
        if (
          pair &&
          guess.player1Id === pair.player1Id &&
          guess.player2Id === pair.player2Id
        ) {
          correctPairs++;
        }
      });
      
      newScores[playerId].spectatorCorrect = correctPairs * 5;
    });

    // Confusion bonus (+2 for each wrong guess on you)
    Object.entries(predictions).forEach(([guesserId, guessedId]) => {
      const guesserPair = pairs.find(
        (pair) => pair.player1Id === guesserId || pair.player2Id === guesserId
      );
      
      if (guesserPair) {
        const actualPartnerId =
          guesserPair.player1Id === guesserId
            ? guesserPair.player2Id
            : guesserPair.player1Id;
        
        // If wrong guess, give confusion bonus to the guessed person
        if (guessedId !== actualPartnerId && newScores[guessedId]) {
          newScores[guessedId].confusionBonus += 2;
        }
      }
    });

    // Calculate totals
    Object.keys(newScores).forEach((playerId) => {
      newScores[playerId].total =
        newScores[playerId].partnerGuess +
        newScores[playerId].spectatorCorrect +
        newScores[playerId].confusionBonus;
    });

    setScores(newScores);
  }, [pairs, players, predictions, spectatorGuesses]);

  // Auto-advance reveal stages
  useEffect(() => {
    if (revealStage < pairs.length) {
      const timer = setTimeout(() => {
        setRevealStage((prev) => prev + 1);
      }, 2500);
      return () => clearTimeout(timer);
    } else if (revealStage === pairs.length && !showConfetti) {
      // Show confetti when all revealed
      setTimeout(() => setShowConfetti(true), 500);
    }
  }, [revealStage, pairs.length, showConfetti]);

  // Get winner(s)
  const maxScore = Math.max(...Object.values(scores).map((s) => s.total));
  const winners = players.filter((p) => scores[p.id]?.total === maxScore);

  // Get player name by ID
  const getPlayerName = (playerId) => {
    return players.find((p) => p.id === playerId)?.name || "Unknown";
  };

  // Get anonymous name
  const getAnonymousName = (pair, playerId) => {
    return pair.anonymousNames?.[playerId] || "Player";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500/10 to-blue-500/10 dark:from-purple-900/20 dark:to-blue-900/20 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-4 py-6 shadow-sm sticky top-0 z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            animate={{
              scale: showConfetti ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.5, repeat: showConfetti ? 3 : 0 }}
          >
            <Heading level={1} className="mb-2">
              🎉 Results Are In! 🎉
            </Heading>
          </motion.div>
          <Text className="text-sm opacity-70">
            Let's see who figured it out...
          </Text>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Stack gap={6}>
          {/* Pair Reveals */}
          <div>
            <Heading level={2} className="mb-4 text-center">
              🔓 Identity Reveals
            </Heading>

            <Stack gap={4}>
              {pairs.map((pair, index) => {
                const isRevealed = revealStage > index;
                const player1 = players.find((p) => p.id === pair.player1Id);
                const player2 = players.find((p) => p.id === pair.player2Id);

                return (
                  <motion.div
                    key={pair.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700"
                  >
                    <Text className="text-sm opacity-70 text-center mb-4">
                      Pair {index + 1}
                    </Text>

                    <div className="flex items-center justify-center gap-4">
                      {/* Player 1 */}
                      <AnimatePresence mode="wait">
                        {!isRevealed ? (
                          <motion.div
                            key="hidden1"
                            initial={{ rotateY: 0 }}
                            exit={{ rotateY: 90 }}
                            transition={{ duration: 0.3 }}
                            className="text-center"
                          >
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-2xl mb-2">
                              ❓
                            </div>
                            <Text className="text-sm font-bold">
                              {getAnonymousName(pair, pair.player1Id)}
                            </Text>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="revealed1"
                            initial={{ rotateY: -90 }}
                            animate={{ rotateY: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-center"
                          >
                            <div
                              className={`w-16 h-16 ${
                                player1?.bubbleColor === "blue"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              } rounded-full flex items-center justify-center text-2xl mb-2`}
                            >
                              👤
                            </div>
                            <Text className="text-sm font-bold">
                              {player1?.name}
                            </Text>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Connection */}
                      <motion.div
                        animate={{
                          scale: isRevealed ? [1, 1.2, 1] : 1,
                        }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl"
                      >
                        💬
                      </motion.div>

                      {/* Player 2 */}
                      <AnimatePresence mode="wait">
                        {!isRevealed ? (
                          <motion.div
                            key="hidden2"
                            initial={{ rotateY: 0 }}
                            exit={{ rotateY: 90 }}
                            transition={{ duration: 0.3 }}
                            className="text-center"
                          >
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-2xl mb-2">
                              ❓
                            </div>
                            <Text className="text-sm font-bold">
                              {getAnonymousName(pair, pair.player2Id)}
                            </Text>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="revealed2"
                            initial={{ rotateY: -90 }}
                            animate={{ rotateY: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-center"
                          >
                            <div
                              className={`w-16 h-16 ${
                                player2?.bubbleColor === "blue"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              } rounded-full flex items-center justify-center text-2xl mb-2`}
                            >
                              👤
                            </div>
                            <Text className="text-sm font-bold">
                              {player2?.name}
                            </Text>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Show who guessed correctly */}
                    {isRevealed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                      >
                        <Text className="text-xs text-center opacity-70 mb-2">
                          Who guessed correctly?
                        </Text>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {[pair.player1Id, pair.player2Id].map((playerId) => {
                            const guess = predictions[playerId];
                            const actualPartnerId =
                              playerId === pair.player1Id
                                ? pair.player2Id
                                : pair.player1Id;
                            const isCorrect = guess === actualPartnerId;

                            return (
                              <div
                                key={playerId}
                                className={`px-3 py-1 rounded-full text-xs ${
                                  isCorrect
                                    ? "bg-green-500/20 text-green-700 dark:text-green-300"
                                    : "bg-red-500/20 text-red-700 dark:text-red-300"
                                }`}
                              >
                                {getPlayerName(playerId)}: {isCorrect ? "✓" : "✗"}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </Stack>
          </div>

          {/* Score Breakdown */}
          <AnimatePresence>
            {revealStage >= pairs.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Heading level={2} className="mb-4 text-center">
                  📊 Score Breakdown
                </Heading>

                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                  {/* Header */}
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 grid grid-cols-5 gap-2 text-xs font-bold">
                    <div>Player</div>
                    <div className="text-center">Partner</div>
                    <div className="text-center">Spectator</div>
                    <div className="text-center">Confusion</div>
                    <div className="text-center">Total</div>
                  </div>

                  {/* Rows */}
                  {players
                    .sort((a, b) => scores[b.id]?.total - scores[a.id]?.total)
                    .map((player, index) => {
                      const score = scores[player.id] || {};
                      const isWinner = winners.some((w) => w.id === player.id);

                      return (
                        <motion.div
                          key={player.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className={`px-4 py-3 grid grid-cols-5 gap-2 text-sm border-t border-gray-200 dark:border-gray-700 ${
                            isWinner
                              ? "bg-yellow-500/20 dark:bg-yellow-500/30"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full ${
                                player.bubbleColor === "blue"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              }`}
                            />
                            <Text className="text-sm font-medium">
                              {player.name}
                              {isWinner && " 👑"}
                            </Text>
                          </div>
                          <div className="text-center">
                            {score.partnerGuess > 0 ? (
                              <span className="text-green-500 font-bold">
                                +{score.partnerGuess}
                              </span>
                            ) : (
                              <span className="opacity-50">0</span>
                            )}
                          </div>
                          <div className="text-center">
                            {score.spectatorCorrect > 0 ? (
                              <span className="text-blue-500 font-bold">
                                +{score.spectatorCorrect}
                              </span>
                            ) : (
                              <span className="opacity-50">0</span>
                            )}
                          </div>
                          <div className="text-center">
                            {score.confusionBonus > 0 ? (
                              <span className="text-purple-500 font-bold">
                                +{score.confusionBonus}
                              </span>
                            ) : (
                              <span className="opacity-50">0</span>
                            )}
                          </div>
                          <div className="text-center font-bold">
                            {score.total}
                          </div>
                        </motion.div>
                      );
                    })}
                </div>

                {/* Legend */}
                <div className="mt-3 flex flex-wrap gap-4 justify-center text-xs opacity-70">
                  <div>Partner: Guessed your partner (+10)</div>
                  <div>Spectator: Correct pair guesses (+5 each)</div>
                  <div>Confusion: Wrong guesses on you (+2 each)</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Winner Announcement */}
          <AnimatePresence>
            {showConfetti && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-600 dark:to-orange-600 rounded-2xl p-8 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="text-6xl mb-4"
                >
                  🏆
                </motion.div>
                <Heading level={1} className="text-white mb-2">
                  {winners.length === 1 ? "Winner!" : "Tie!"}
                </Heading>
                <Heading level={2} className="text-white">
                  {winners.map((w) => w.name).join(" & ")}
                </Heading>
                <Text className="text-white/90 mt-2 text-lg font-bold">
                  {maxScore} points
                </Text>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue Button */}
          {showConfetti && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Button onClick={onContinue} size="lg" className="w-full py-4">
                Continue →
              </Button>
            </motion.div>
          )}
        </Stack>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: 360,
                x: Math.random() * window.innerWidth,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "linear",
              }}
              className="absolute text-2xl"
            >
              {["🎉", "🎊", "⭐", "✨", "🏆"][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}