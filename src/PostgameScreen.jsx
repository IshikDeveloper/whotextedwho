import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Stack, Text, Heading, Button } from "../../lib";

export default function PostGameScreen({
  players = [],
  currentPlayerId,
  winner,
  finalScores = {},
  onPlayAgain,
  onReturnToMenu,
}) {
  const [votes, setVotes] = useState({ playAgain: [], menu: [] });
  const [hasVoted, setHasVoted] = useState(false);
  const [currentVote, setCurrentVote] = useState(null);

  // Simulate voting (in real app, this comes from WebSocket)
  const handleVote = (voteType) => {
    if (hasVoted) return;

    setCurrentVote(voteType);
    setHasVoted(true);

    // Update votes
    setVotes((prev) => ({
      ...prev,
      [voteType]: [...prev[voteType], currentPlayerId],
    }));
  };

  // Check if everyone voted the same way
  const totalVotes = votes.playAgain.length + votes.menu.length;
  const allVotedPlayAgain =
    votes.playAgain.length === players.length && totalVotes === players.length;
  const allVotedMenu =
    votes.menu.length === players.length && totalVotes === players.length;

  useEffect(() => {
    if (allVotedPlayAgain) {
      setTimeout(() => onPlayAgain?.(), 2000);
    } else if (allVotedMenu) {
      setTimeout(() => onReturnToMenu?.(), 2000);
    }
  }, [allVotedPlayAgain, allVotedMenu, onPlayAgain, onReturnToMenu]);

  const getPlayerName = (playerId) => {
    return players.find((p) => p.id === playerId)?.name || "Unknown";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Stack gap={6} className="px-4">
          {/* Winner Recap */}
          <div className="text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              className="text-6xl mb-4"
            >
              {allVotedPlayAgain ? "🎮" : allVotedMenu ? "👋" : "🏁"}
            </motion.div>
            <Heading level={2} className="mb-2">
              {allVotedPlayAgain
                ? "Starting New Game..."
                : allVotedMenu
                ? "Returning to Menu..."
                : "Game Over!"}
            </Heading>
            <Text className="text-sm opacity-70">
              {winner && `${winner.name} won with ${finalScores[winner.id] || 0} points!`}
            </Text>
          </div>

          {/* Final Leaderboard */}
          {!allVotedPlayAgain && !allVotedMenu && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700"
            >
              <Heading level={3} className="text-center mb-4 text-lg">
                📊 Final Standings
              </Heading>

              <Stack gap={2}>
                {players
                  .sort((a, b) => (finalScores[b.id] || 0) - (finalScores[a.id] || 0))
                  .map((player, index) => {
                    const score = finalScores[player.id] || 0;
                    const isWinner = winner?.id === player.id;

                    return (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isWinner
                            ? "bg-yellow-500/20 border-2 border-yellow-500/40"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-xl font-bold w-8 text-center opacity-70">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full ${
                              player.bubbleColor === "blue"
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                          />
                          <Text className="font-medium">
                            {player.name}
                            {player.id === currentPlayerId && " (You)"}
                          </Text>
                        </div>
                        <Text className="font-bold text-lg">{score}</Text>
                      </motion.div>
                    );
                  })}
              </Stack>
            </motion.div>
          )}

          {/* Voting Section */}
          {!allVotedPlayAgain && !allVotedMenu && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Heading level={3} className="text-center mb-4 text-lg">
                What's Next?
              </Heading>

              {!hasVoted ? (
                <Stack gap={3}>
                  <Button
                    onClick={() => handleVote("playAgain")}
                    size="lg"
                    className="w-full py-4"
                  >
                    🔄 Play Again
                  </Button>
                  <Button
                    onClick={() => handleVote("menu")}
                    variant="outline"
                    size="lg"
                    className="w-full py-4"
                  >
                    🏠 Return to Menu
                  </Button>
                </Stack>
              ) : (
                <div className="bg-blue-500/10 dark:bg-blue-500/20 rounded-xl p-6 text-center border-2 border-blue-500/40">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-4xl mb-3"
                  >
                    ✓
                  </motion.div>
                  <Text className="font-bold mb-1">Vote Recorded!</Text>
                  <Text className="text-sm opacity-70">
                    You voted to {currentVote === "playAgain" ? "play again" : "return to menu"}
                  </Text>
                </div>
              )}
            </motion.div>
          )}

          {/* Vote Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4"
          >
            <Text className="text-sm font-bold opacity-70 text-center mb-3">
              Voting Status
            </Text>

            <Stack gap={3}>
              {/* Play Again Votes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Text className="text-sm">🔄 Play Again</Text>
                  <Text className="text-sm font-bold">
                    {votes.playAgain.length}/{players.length}
                  </Text>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(votes.playAgain.length / players.length) * 100}%`,
                    }}
                    className="bg-blue-500 h-2 rounded-full"
                  />
                </div>
                {votes.playAgain.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {votes.playAgain.map((playerId) => (
                      <span
                        key={playerId}
                        className="text-xs bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
                      >
                        {getPlayerName(playerId)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Return to Menu Votes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Text className="text-sm">🏠 Return to Menu</Text>
                  <Text className="text-sm font-bold">
                    {votes.menu.length}/{players.length}
                  </Text>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(votes.menu.length / players.length) * 100}%`,
                    }}
                    className="bg-gray-500 h-2 rounded-full"
                  />
                </div>
                {votes.menu.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {votes.menu.map((playerId) => (
                      <span
                        key={playerId}
                        className="text-xs bg-gray-500/20 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                      >
                        {getPlayerName(playerId)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Stack>

            {totalVotes < players.length && (
              <Text className="text-xs text-center mt-3 opacity-60">
                All players must vote to continue
              </Text>
            )}
          </motion.div>

          {/* Fun Stats (Optional) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-yellow-500/10 dark:bg-yellow-500/20 rounded-xl p-4"
          >
            <Text className="text-xs text-center">
              💡 <strong>Thanks for playing!</strong> Want revenge? Vote to play
              again and show everyone your texting detective skills!
            </Text>
          </motion.div>
        </Stack>
      </motion.div>
    </div>
  );
}