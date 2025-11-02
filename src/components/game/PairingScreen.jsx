import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Stack, Text, Heading } from "../../lib";
import { useTheme } from "../../contexts/ThemeContext";

export default function PairingScreen({ 
  playerCount,
  isSpectator = false,
  onPairingComplete 
}) {
  const [dots, setDots] = useState("");
  const [stage, setStage] = useState(0);
  const { theme } = useTheme();

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Progress through stages
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 800),
      setTimeout(() => setStage(2), 1600),
      setTimeout(() => setStage(3), 2400),
    ];

    // Complete pairing after 3 seconds
    const completeTimer = setTimeout(() => {
      if (onPairingComplete) onPairingComplete();
    }, 3000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [onPairingComplete]);

  const messages = [
    "Shuffling players",
    "Creating anonymous pairs",
    "Preparing chat rooms",
    isSpectator ? "You'll spectate this round" : "Finding your partner",
  ];

  return (
    <Container className={`min-h-screen min-w-screen justify-center py-8 bg-gray-${theme === "dark" ? "900" : "50"}`}>
      <Stack gap={8} className={`items-center text-center text-${theme === "dark" ? "white" : "black"} px-4 max-w-md`}>
        {/* Main Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="relative"
        >
          {/* Spinning outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 rounded-full border-4 border-blue-500/30 border-t-blue-500"
          />

          {/* Center icon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute inset-0 flex items-center justify-center text-6xl"
          >
            {isSpectator ? "👀" : "🔀"}
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Heading level={2} className={`mb-2 text-${theme === "dark" ? "white" : "black"}`}>
            {isSpectator ? "You're Spectating!" : "Pairing Players"}
          </Heading>
          <Text className={`text-sm opacity-70 text-${theme === "dark" ? "white" : "black"}`}>
            {isSpectator 
              ? "Odd number of players - You'll watch and predict this round"
              : "You'll be matched anonymously with another player"
            }
          </Text>
        </motion.div>

        {/* Progress Messages */}
        <div className="w-full space-y-3">
          <AnimatePresence mode="wait">
            {messages.slice(0, stage + 1).map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  index === stage
                    ? "bg-blue-500/20 border border-blue-500/40"
                    : `bg-gray-${theme === "dark" ? "800" : "100"}`
                }`}
              >
                {index < stage ? (
                  <span className="text-green-500 text-lg">✓</span>
                ) : (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-blue-500 text-lg"
                  >
                    ⟳
                  </motion.span>
                )}
                <Text className="text-sm">
                  {message}
                  {index === stage && dots}
                </Text>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Player Count Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`bg-gray-${theme === "dark" ? "800" : "100"} rounded-xl p-4 w-full`}
        >
          <Text className="text-xs opacity-70 text-center">
            {isSpectator 
              ? `${playerCount} players total • ${Math.floor(playerCount / 2)} pairs competing`
              : `${playerCount} players • ${Math.floor(playerCount / 2)} pairs will be formed`
            }
          </Text>
        </motion.div>

        {/* Fun Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-yellow-500/10 dark:bg-yellow-500/20 rounded-xl p-4 w-full"
        >
          <Text className={`text-xs text-${theme === "dark" ? "white" : "black"}`}>
            <strong>💡 Pro Tip:</strong> {isSpectator 
              ? "Watch carefully! You can earn points by predicting who's texting in each pair."
              : "Pay attention to texting styles - spelling, punctuation, emojis... everything is a clue!"
            }
          </Text>
        </motion.div>

        {/* Animated emoji pairs */}
        {!isSpectator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex gap-4 items-center"
          >
            <motion.span
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-4xl"
            >
              👤
            </motion.span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-2xl"
            >
              💬
            </motion.span>
            <motion.span
              animate={{ x: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-4xl"
            >
              👤
            </motion.span>
          </motion.div>
        )}
      </Stack>
    </Container>
  );
}