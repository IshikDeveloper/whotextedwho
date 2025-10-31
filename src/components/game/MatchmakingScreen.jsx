import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Stack, Text, Heading, Button, TextField } from "../../lib";
import { useTheme } from "../../lib";

export default function MatchmakingScreen({
  onCreateMatch,
  onJoinMatch,
  onFindPublicMatch,
}) {
  // User settings
  const [username, setUsername] = useState("");
  const [bubbleColor, setBubbleColor] = useState("blue");
  const [matchType, setMatchType] = useState("public"); // public or private
  const [secretCode, setSecretCode] = useState("");
  
  // Join mode
  const [mode, setMode] = useState("main"); // main, join-private, creating
  const [roomCode, setRoomCode] = useState("");
  
  // Secret unlocks
  const [unlockedBubbles, setUnlockedBubbles] = useState([]);
  const [showSecretSuccess, setShowSecretSuccess] = useState(false);

  const { theme, toggleTheme } = useTheme();

  // Secret codes for special bubbles
  const secretCodes = {
    "RAINBOW": { color: "rainbow", emoji: "🌈", name: "Rainbow" },
    "GOLDEN": { color: "gold", emoji: "✨", name: "Golden" },
    "FIRE": { color: "fire", emoji: "🔥", name: "Fire" },
    "ICE": { color: "ice", emoji: "❄️", name: "Ice" },
    "GALAXY": { color: "galaxy", emoji: "🌌", name: "Galaxy" },
  };

  const handleSecretCode = () => {
    const code = secretCode.toUpperCase().trim();
    if (secretCodes[code] && !unlockedBubbles.includes(code)) {
      setUnlockedBubbles((prev) => [...prev, code]);
      setShowSecretSuccess(true);
      setTimeout(() => {
        setShowSecretSuccess(false);
        setSecretCode("");
      }, 3000);
    } else if (secretCodes[code]) {
      alert("You already unlocked this!");
    } else {
      alert("Invalid code!");
    }
  };

  const handleCreateMatch = () => {
    if (!username.trim()) {
      alert("Please enter a username!");
      return;
    }
    onCreateMatch?.({ username, bubbleColor, matchType });
  };

  const handleJoinPublic = () => {
    if (!username.trim()) {
      alert("Please enter a username!");
      return;
    }
    onFindPublicMatch?.({ username, bubbleColor });
  };

  const handleJoinPrivate = () => {
    if (!username.trim()) {
      alert("Please enter a username!");
      return;
    }
    if (!roomCode.trim() || roomCode.length !== 6) {
      alert("Please enter a valid 6-character room code!");
      return;
    }
    onJoinMatch?.({ username, bubbleColor, roomCode: roomCode.toUpperCase() });
  };

  // Get all available bubble colors
  const allBubbleColors = [
    { value: "blue", emoji: "🔵", name: "Blue" },
    { value: "green", emoji: "🟢", name: "Green" },
    ...unlockedBubbles.map((code) => ({
      value: secretCodes[code].color,
      emoji: secretCodes[code].emoji,
      name: secretCodes[code].name,
    })),
  ];

  // MAIN SCREEN
  if (mode === "main") {
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
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-6xl mb-4"
              >
                📱
              </motion.div>
              <Heading level={1} className="mb-2">
                WHO TEXTED WHAT?
              </Heading>
              <Text className="text-sm opacity-70">
                The ultimate texting detective game
              </Text>
            </div>

            {/* Username Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Text className="text-sm opacity-70 mb-2">Your Username</Text>
              <TextField
                value={username}
                onChange={setUsername}
                placeholder="Enter your name..."
                maxLength={20}
              />
              {username.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1"
                >
                  <Text className="text-xs opacity-50">
                    {username.length}/20 characters
                  </Text>
                </motion.div>
              )}
            </motion.div>

            {/* Bubble Color Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Text className="text-sm opacity-70 mb-2">Bubble Color</Text>
              <div className="grid grid-cols-3 gap-2">
                {allBubbleColors.map((color) => (
                  <motion.button
                    key={color.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setBubbleColor(color.value)}
                    className={`p-3 rounded-xl border-2 transition ${
                      bubbleColor === color.value
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-400"
                    }`}
                  >
                    <div className="text-3xl mb-1">{color.emoji}</div>
                    <Text className="text-xs font-medium">{color.name}</Text>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Match Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Text className="text-sm opacity-70 mb-2">Match Type</Text>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMatchType("public")}
                  className={`p-4 rounded-xl border-2 transition ${
                    matchType === "public"
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  }`}
                >
                  <div className="text-3xl mb-2">🌍</div>
                  <Text className="text-sm font-bold">Public</Text>
                  <Text className="text-xs opacity-70">
                    Play with anyone
                  </Text>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMatchType("private")}
                  className={`p-4 rounded-xl border-2 transition ${
                    matchType === "private"
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  }`}
                >
                  <div className="text-3xl mb-2">🔒</div>
                  <Text className="text-sm font-bold">Private</Text>
                  <Text className="text-xs opacity-70">
                    Friends only
                  </Text>
                </motion.button>
              </div>
            </motion.div>

            {/* Theme Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between py-2"
            >
              <Text className="text-sm opacity-70">Theme</Text>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
              </Button>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Stack gap={3}>
                <Button
                  onClick={handleCreateMatch}
                  size="lg"
                  className="w-full py-4"
                  disabled={!username.trim()}
                >
                  {matchType === "public" ? "🌍 Create Public Match" : "🔒 Create Private Match"}
                </Button>

                {matchType === "public" ? (
                  <Button
                    onClick={handleJoinPublic}
                    variant="outline"
                    size="lg"
                    className="w-full py-4"
                    disabled={!username.trim()}
                  >
                    🔍 Find Public Match
                  </Button>
                ) : (
                  <Button
                    onClick={() => setMode("join-private")}
                    variant="outline"
                    size="lg"
                    className="w-full py-4"
                    disabled={!username.trim()}
                  >
                    🔐 Join Private Room
                  </Button>
                )}
              </Stack>
            </motion.div>

            {/* Secret Code Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-purple-500/10 dark:bg-purple-500/20 rounded-xl p-4 border border-purple-500/30"
            >
              <Text className="text-sm font-bold mb-2">🔐 Secret Codes</Text>
              <Text className="text-xs opacity-70 mb-3">
                Unlock special bubble designs with secret codes!
              </Text>
              <div className="flex gap-2">
                <TextField
                  value={secretCode}
                  onChange={setSecretCode}
                  placeholder="Enter code..."
                  className="flex-1 text-center uppercase"
                  maxLength={10}
                />
                <Button
                  onClick={handleSecretCode}
                  size="sm"
                  disabled={!secretCode.trim()}
                >
                  Unlock
                </Button>
              </div>
              
              {unlockedBubbles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 pt-3 border-t border-purple-500/30"
                >
                  <Text className="text-xs opacity-70 mb-2">
                    Unlocked ({unlockedBubbles.length}/5):
                  </Text>
                  <div className="flex flex-wrap gap-2">
                    {unlockedBubbles.map((code) => (
                      <span
                        key={code}
                        className="px-2 py-1 bg-purple-500/20 rounded text-xs"
                      >
                        {secretCodes[code].emoji} {secretCodes[code].name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* How to Play */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-blue-500/10 dark:bg-blue-500/20 rounded-xl p-4"
            >
              <Text className="text-xs">
                <strong>💡 How to Play:</strong> Chat anonymously with a random player,
                then guess who they are. Predict correctly for points!
              </Text>
            </motion.div>
          </Stack>
        </motion.div>

        {/* Secret Code Success Toast */}
        <AnimatePresence>
          {showSecretSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50"
            >
              <Text className="text-sm font-bold">
                ✨ New bubble unlocked: {secretCodes[unlockedBubbles[unlockedBubbles.length - 1]]?.name}!
              </Text>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    );
  }

  // JOIN PRIVATE ROOM SCREEN
  if (mode === "join-private") {
    return (
      <Container className="min-h-screen justify-center py-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Stack gap={6} className="px-4">
            <div className="text-center">
              <div className="text-5xl mb-4">🔐</div>
              <Heading level={2} className="mb-2">
                Join Private Room
              </Heading>
              <Text className="text-sm opacity-70">
                Enter the 6-character room code from your friend
              </Text>
            </div>

            <div className="bg-blue-500/10 dark:bg-blue-500/20 rounded-xl p-4">
              <Text className="text-sm mb-2">
                <strong>Joining as:</strong> {username}
              </Text>
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full ${
                    allBubbleColors.find((c) => c.value === bubbleColor)?.value === "blue"
                      ? "bg-blue-500"
                      : allBubbleColors.find((c) => c.value === bubbleColor)?.value === "green"
                      ? "bg-green-500"
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}
                />
                <Text className="text-sm">
                  {allBubbleColors.find((c) => c.value === bubbleColor)?.emoji}{" "}
                  {allBubbleColors.find((c) => c.value === bubbleColor)?.name} bubbles
                </Text>
              </div>
            </div>

            <div>
              <Text className="text-sm opacity-70 mb-2">Room Code</Text>
              <TextField
                value={roomCode}
                onChange={(val) => setRoomCode(val.toUpperCase())}
                placeholder="ABC123"
                className="text-center text-2xl font-mono tracking-widest uppercase"
                maxLength={6}
              />
            </div>

            <Button
              onClick={handleJoinPrivate}
              size="lg"
              className="w-full py-4"
              disabled={roomCode.length !== 6}
            >
              Join Room
            </Button>

            <Button
              onClick={() => {
                setMode("main");
                setRoomCode("");
              }}
              variant="ghost"
              className="w-full"
            >
              ← Back
            </Button>
          </Stack>
        </motion.div>
      </Container>
    );
  }
}