import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Stack, Text, Heading, Button, Container } from "../../lib";
import { useTheme } from "../../contexts/ThemeContext";

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
  const { theme } = useTheme();

  const handleVote = (voteType) => {
    if (hasVoted) return;
    setCurrentVote(voteType);
    setHasVoted(true);
    setVotes((prev) => ({
      ...prev,
      [voteType]: [...prev[voteType], currentPlayerId],
    }));
  };

  const totalVotes = votes.playAgain.length + votes.menu.length;
  const allVotedPlayAgain =
    votes.playAgain.length === players.length && totalVotes === players.length;
  const allVotedMenu =
    votes.menu.length === players.length && totalVotes === players.length;

  useEffect(() => {
    if (allVotedPlayAgain) setTimeout(() => onPlayAgain?.(), 2000);
    else if (allVotedMenu) setTimeout(() => onReturnToMenu?.(), 2000);
  }, [allVotedPlayAgain, allVotedMenu, onPlayAgain, onReturnToMenu]);

  const getPlayerName = (playerId) =>
    players.find((p) => p.id === playerId)?.name || "Unknown";

  return (
    <Container
      className={`min-h-screen flex items-center justify-center p-4 bg-gray-${
        theme === "dark" ? "900" : "50"
      }`}
    >
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

            <Heading
              level={2}
              className={`mb-2 text-${theme === "dark" ? "white" : "black"}`}
            >
              {allVotedPlayAgain
                ? "Starting New Game..."
                : allVotedMenu
                ? "Returning to Menu..."
                : "Game Over!"}
            </Heading>

            <Text
              className={`text-sm opacity-70 text-${theme === "dark" ? "white" : "black"}`}
            >
              {winner &&
                `${winner.name} won with ${finalScores[winner.id] || 0} points!`}
            </Text>
          </div>

          {/* Final Leaderboard */}
          {!allVotedPlayAgain && !allVotedMenu && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`rounded-xl p-4 border-2 border-gray-${
                theme === "dark" ? "700" : "200"
              } bg-gray-${theme === "dark" ? "800" : "white"}`}
            >
              <Heading
                level={3}
                className={`text-center mb-4 text-lg text-${theme === "dark" ? "white" : "black"}`}
              >
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
                            : `bg-gray-${theme === "dark" ? "700" : "100"}`
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-xl font-bold w-8 text-center opacity-70">
                            {index === 0
                              ? "🥇"
                              : index === 1
                              ? "🥈"
                              : index === 2
                              ? "🥉"
                              : `#${index + 1}`}
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full ${
                              player.bubbleColor === "blue"
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                          />
                          <Text
                            className={`font-medium text-${theme === "dark" ? "white" : "black"}`}
                          >
                            {player.name}
                            {player.id === currentPlayerId && " (You)"}
                          </Text>
                        </div>
                        <Text
                          className={`font-bold text-lg text-${theme === "dark" ? "white" : "black"}`}
                        >
                          {score}
                        </Text>
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
              <Heading
                level={3}
                className={`text-center mb-4 text-lg text-${theme === "dark" ? "white" : "black"}`}
              >
                What's Next?
              </Heading>

              {!hasVoted ? (
                <Stack gap={3}>
                  <Button onClick={() => handleVote("playAgain")} size="lg" className="w-full py-4">
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
                <div
                  className={`rounded-xl p-6 text-center border-2 border-blue-500/40 bg-blue-500/${
                    theme === "dark" ? "20" : "10"
                  }`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-4xl mb-3"
                  >
                    ✓
                  </motion.div>
                  <Text
                    className={`font-bold mb-1 text-${theme === "dark" ? "white" : "black"}`}
                  >
                    Vote Recorded!
                  </Text>
                  <Text
                    className={`text-sm opacity-70 text-${theme === "dark" ? "white" : "black"}`}
                  >
                    You voted to{" "}
                    {currentVote === "playAgain" ? "play again" : "return to menu"}
                  </Text>
                </div>
              )}
            </motion.div>
          )}

          {/* Voting Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`rounded-xl p-4 bg-gray-${theme === "dark" ? "800" : "100"}`}
          >
            <Text
              className={`text-sm font-bold opacity-70 text-center mb-3 text-${theme === "dark" ? "white" : "black"}`}
            >
              Voting Status
            </Text>

            <Stack gap={3}>
              {/* Play Again Votes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Text className={`text-sm text-${theme === "dark" ? "white" : "black"}`}>
                    🔄 Play Again
                  </Text>
                  <Text className={`text-sm font-bold text-${theme === "dark" ? "white" : "black"}`}>
                    {votes.playAgain.length}/{players.length}
                  </Text>
                </div>
                <div
                  className={`w-full rounded-full h-2 bg-gray-${theme === "dark" ? "700" : "200"}`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(votes.playAgain.length / players.length) * 100}%`,
                    }}
                    className="bg-blue-500 h-2 rounded-full"
                  />
                </div>
              </div>

              {/* Return to Menu Votes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Text className={`text-sm text-${theme === "dark" ? "white" : "black"}`}>
                    🏠 Return to Menu
                  </Text>
                  <Text className={`text-sm font-bold text-${theme === "dark" ? "white" : "black"}`}>
                    {votes.menu.length}/{players.length}
                  </Text>
                </div>
                <div
                  className={`w-full rounded-full h-2 bg-gray-${theme === "dark" ? "700" : "200"}`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(votes.menu.length / players.length) * 100}%`,
                    }}
                    className="bg-gray-500 h-2 rounded-full"
                  />
                </div>
              </div>
            </Stack>

            {totalVotes < players.length && (
              <Text
                className={`text-xs text-center mt-3 opacity-60 text-${theme === "dark" ? "white" : "black"}`}
              >
                All players must vote to continue
              </Text>
            )}
          </motion.div>

          {/* Fun Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className={`rounded-xl p-4 bg-yellow-500/${theme === "dark" ? "20" : "10"}`}
          >
            <Text className={`text-xs text-center text-${theme === "dark" ? "white" : "black"}`}>
              💡 <strong>Thanks for playing!</strong> Want revenge? Vote to play
              again and show everyone your texting detective skills!
            </Text>
          </motion.div>
        </Stack>
      </motion.div>
    </Container>
  );
}
