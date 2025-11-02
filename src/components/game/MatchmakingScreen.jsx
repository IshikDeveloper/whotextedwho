import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Stack, Text, Heading, Button, TextField, TextBubble } from "../../lib";
import { useTheme } from "../../contexts/ThemeContext";

export default function MatchmakingScreen({
  onCreateMatch,
  onJoinMatch,
  onFindPublicMatch,
}) {
  const [username, setUsername] = useState("");
  const [bubbleColor, setBubbleColor] = useState("blue");
  const [matchType, setMatchType] = useState("public");
  const [secretCode, setSecretCode] = useState("");
  const [mode, setMode] = useState("main");
  const [roomCode, setRoomCode] = useState("");
  const [unlockedBubbles, setUnlockedBubbles] = useState([]);
  const [showSecretSuccess, setShowSecretSuccess] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false); // New state for popup

  const { theme, toggleTheme } = useTheme();

  const secretCodes = {
    RAINBOW: { color: "rainbow", emoji: "🌈", name: "Rainbow" },
    GOLDEN: { color: "gold", emoji: "✨", name: "Golden" },
    FIRE: { color: "fire", emoji: "🔥", name: "Fire" },
    ICE: { color: "ice", emoji: "❄️", name: "Ice" },
    GALAXY: { color: "galaxy", emoji: "🌌", name: "Galaxy" },
    ADAMY: { color: "matrix", emoji: "💻", name: "Dev Bubble" },
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
    if (!username.trim()) return alert("Please enter a username!");
    onCreateMatch?.({ username, bubbleColor, matchType });
  };

  const handleJoinPublic = () => {
    if (!username.trim()) return alert("Please enter a username!");
    onFindPublicMatch?.({ username, bubbleColor });
  };

  const handleJoinPrivate = () => {
    if (!username.trim()) return alert("Please enter a username!");
    if (!roomCode.trim() || roomCode.length !== 6)
      return alert("Please enter a valid 6-character room code!");
    onJoinMatch?.({ username, bubbleColor, roomCode: roomCode.toUpperCase() });
    setShowJoinPopup(false); // Close popup after joining
  };

  const allBubbleColors = [
    { value: "blue", emoji: "🔵", name: "Blue" },
    { value: "green", emoji: "🟢", name: "Green" },
    ...unlockedBubbles.map((code) => secretCodes[code]),
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === "dark"
        ? "bg-gray-900 text-gray-100"
        : "bg-gray-50 text-gray-900"
        }`}
    >
      <Container className="py-8 justify-center">
        {mode === "main" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Stack gap={6} className="px-4">
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

              {/* Username */}
              <div>
                <Text className="text-sm opacity-70 mb-2">Your Username</Text>
                <TextField
                  value={username}
                  theme={theme}
                  onChange={setUsername}
                  className={`${theme === "dark"
                    ? "bg-gray-800 border-gray-700 placeholder-gray-400"
                    : "bg-white border-gray-300 placeholder-gray-500"
                    }`}
                  placeholder="Enter your name..."
                  maxLength={20}
                />
                {username.length > 0 && (
                  <Text className="text-xs opacity-50 mt-1">
                    {username.length}/20 characters
                  </Text>
                )}
              </div>

              {/* Bubble color */}
              <div>
                <Text className="text-sm opacity-70 mb-2">Bubble Color</Text>
                <div className="grid grid-cols-3 gap-2">
                  {allBubbleColors.map((color) => (
                    <motion.button
                      key={color.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setBubbleColor(color.value)}
                      className={`p-3 rounded-xl border-2 transition ${bubbleColor === color.value
                        ? "border-blue-500 bg-blue-500/20"
                        : theme === "dark"
                          ? "border-gray-600 bg-gray-800 hover:border-blue-400"
                          : "border-gray-300 bg-white hover:border-blue-400"
                        }`}
                    >
                      <div className="text-3xl mb-1">{color.emoji}</div>
                      <Text className="text-xs font-medium">{color.name}</Text>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Match type */}
              <div>
                <Text className="text-sm opacity-70 mb-2">Match Type</Text>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: "public", icon: "🌍", label: "Public", desc: "Play with anyone" },
                    { type: "private", icon: "🔒", label: "Private", desc: "Friends only" },
                  ].map(({ type, icon, label, desc }) => (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setMatchType(type)}
                      className={`p-4 rounded-xl border-2 transition ${matchType === type
                        ? "border-blue-500 bg-blue-500/20"
                        : theme === "dark"
                          ? "border-gray-600 bg-gray-800"
                          : "border-gray-300 bg-white"
                        }`}
                    >
                      <div className="text-3xl mb-2">{icon}</div>
                      <Text className="text-sm font-bold">{label}</Text>
                      <Text className="text-xs opacity-70">{desc}</Text>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Theme toggle */}
              <div className="flex items-center justify-between py-2">
                <Text className="text-sm opacity-70">Theme</Text>
                <Button variant="ghost" size="sm" onClick={toggleTheme} theme={theme}>
                  {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
                </Button>
              </div>

              {/* Actions */}
              <Stack gap={3}>
                <Button
                  onClick={handleCreateMatch}
                  size="lg"
                  className="w-full py-4"
                  disabled={!username.trim()}
                  theme={theme}
                >
                  {matchType === "public"
                    ? "🌍 Create Public Match"
                    : "🔒 Create Private Match"}
                </Button>

                {matchType === "public" ? (
                  <Button
                    onClick={handleJoinPublic}
                    variant="outline"
                    size="lg"
                    className="w-full py-4"
                    disabled={!username.trim()}
                    theme={theme}
                  >
                    🔍 Find Public Match
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowJoinPopup(true)} // Show popup instead of changing mode
                    variant="outline"
                    size="lg"
                    className="w-full py-4"
                    disabled={!username.trim()}
                  >
                    🔐 Join Private Room
                  </Button>
                )}
              </Stack>

              {/* Secret codes */}
              <div
                className={`rounded-xl p-4 border mt-4 ${theme === "dark"
                  ? "bg-purple-500/20 border-purple-500/30"
                  : "bg-purple-500/10 border-purple-500/30"
                  }`}
              >
                <Text className="text-sm font-bold mb-2">🔐 Secret Codes</Text>
                <Text className="text-xs opacity-70 mb-3">
                  Unlock special bubble designs with secret codes!
                </Text>
                <div className="flex gap-2">
                  <TextField
                    value={secretCode}
                    onChange={setSecretCode}
                    theme={theme}
                    placeholder="Enter code..."
                    className={`flex-1 text-center uppercase rounded-lg border px-3 py-2 outline-none transition
  ${theme === "dark"
                        ? "bg-gray-800 border-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      }`}

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
              </div>

              {/* How to play */}
              <div
                className={`rounded-xl p-4 ${theme === "dark"
                  ? "bg-blue-500/20"
                  : "bg-blue-500/10"
                  }`}
              >
                <Text className="text-xs">
                  <strong>💡 How to Play:</strong> Chat anonymously with a random
                  player, then guess who they are. Predict correctly for points!
                </Text>
              </div>
            </Stack>
          </motion.div>
        )}

        {/* Join Private Match Popup */}
        <AnimatePresence>
          {showJoinPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowJoinPopup(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`rounded-xl p-6 w-full max-w-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Heading level={2} className="mb-4 text-center">
                  🔐 Join Private Match
                </Heading>
                
                <Text className="mb-4 text-center opacity-70">
                  Enter the 6-character room code to join a private match
                </Text>
                
                <div className="mb-6">
                  <Text className="text-sm opacity-70 mb-2">Room Code</Text>
                  <TextField
                    value={roomCode}
                    onChange={setRoomCode}
                    theme={theme}
                    placeholder="ABC123"
                    className={`w-full text-center uppercase tracking-widest text-lg`}
                    maxLength={6}
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowJoinPopup(false)}
                    className="flex-1"
                    theme={theme}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleJoinPrivate}
                    className="flex-1"
                    disabled={!roomCode.trim() || roomCode.length !== 6}
                    theme={theme}
                  >
                    Join Match
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Secret success toast */}
        <AnimatePresence>
          {showSecretSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50"
            >
              <Text className="text-sm font-bold">
                ✨ New bubble unlocked:{" "}
                {secretCodes[unlockedBubbles.at(-1)]?.name}!
              </Text>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}