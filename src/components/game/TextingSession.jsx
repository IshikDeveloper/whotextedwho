import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Stack, Text, TextBubble } from "../../lib";
import { useTheme } from "../../contexts/ThemeContext";

export default function TextingSession({
  anonymousPartnerName = "Player B",
  messages = [],
  currentPlayerId,
  timeLeft = 180,
  onSendMessage,
  onTypingStart,
  onTypingStop,
  partnerTyping = false,
  playerNames = [],
  bubbleColor = "blue",
}) {
  const [inputText, setInputText] = useState("");
  const [filteredWarning, setFilteredWarning] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { theme } = useTheme();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Name filter function
  const filterText = (text) => {
    let filtered = text;
    let wasFiltered = false;

    playerNames.forEach((name) => {
      const regex = new RegExp(name, "gi");
      if (regex.test(filtered)) {
        wasFiltered = true;
        filtered = filtered.replace(regex, "***");
      }

      // Also check for spaced out names (e.g., "j o h n")
      const spacedName = name.split("").join(" ");
      const spacedRegex = new RegExp(spacedName, "gi");
      if (spacedRegex.test(filtered)) {
        wasFiltered = true;
        filtered = filtered.replace(spacedRegex, "***");
      }
    });

    return { filtered, wasFiltered };
  };

  // Handle input change
  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);

    // Typing indicator logic
    if (text.length > 0) {
      if (!typingTimeout) {
        onTypingStart?.();
      }

      // Clear existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // Set new timeout
      const timeout = setTimeout(() => {
        onTypingStop?.();
        setTypingTimeout(null);
      }, 1000);

      setTypingTimeout(timeout);
    } else {
      onTypingStop?.();
      if (typingTimeout) {
        clearTimeout(typingTimeout);
        setTypingTimeout(null);
      }
    }
  };

  // Handle send message
  const handleSend = () => {
    if (!inputText.trim()) return;

    const { filtered, wasFiltered } = filterText(inputText);

    if (wasFiltered) {
      setFilteredWarning(true);
      setTimeout(() => setFilteredWarning(false), 3000);
    }

    onSendMessage?.(filtered);
    setInputText("");
    onTypingStop?.();
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Warning for low time
  const isLowTime = timeLeft <= 30;

  return (
    <div className={`flex flex-col h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b px-4 py-3 shadow-sm`}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* Partner Info */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"} flex items-center justify-center text-xl`}>
              ❓
            </div>
            <div>
              <Text className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>{anonymousPartnerName}</Text>
              <AnimatePresence>
                {partnerTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} text-xs`}
                  >
                    typing...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Timer */}
          <motion.div
            animate={{
              scale: isLowTime ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: isLowTime ? Infinity : 0,
            }}
            className={`px-4 py-2 rounded-full font-mono font-bold ${isLowTime
              ? "bg-red-500 text-white"
              : `${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"}`
              }`}
          >
            ⏱️ {formatTime(timeLeft)}
          </motion.div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl w-full mx-auto">
        <Stack gap={3} className="mb-4">
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${theme === "dark" ? "bg-blue-500/20" : "bg-blue-500/10"} rounded-xl p-3 text-center mb-4`}
          >
            <Text className={`text-xs ${theme === "dark" ? "text-white" : "text-black"}`}>
              🤫 You're chatting anonymously with{" "}
              <strong>{anonymousPartnerName}</strong>
              <br />
              Try to figure out who they are!
            </Text>
          </motion.div>

          {/* Messages */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center py-8"
            >
              <Text className={`text-sm opacity-50 ${theme === "dark" ? "text-white" : "text-black"}`}>
                Say hi to get started! 👋
              </Text>
            </motion.div>
          )}

          {messages.map((msg, index) => {
            const isCurrentPlayer = msg.playerId === currentPlayerId;

            // 🐛 DEBUG: Log what we're rendering
            console.log('🎨 Rendering bubble:', {
              index,
              isCurrentPlayer,
              bubbleColor: msg.bubbleColor,
              text: msg.text,
              playerId: msg.playerId
            });

            return (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TextBubble
                  side={isCurrentPlayer ? "right" : "left"}
                  color={msg.bubbleColor || (isCurrentPlayer ? bubbleColor : "gray")}
                >
                  {msg.text}
                </TextBubble>
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          <AnimatePresence>
            {partnerTyping && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex justify-start"
              >
                <div className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-300"} px-4 py-2 rounded-2xl`}>
                  <motion.div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        className={`${theme === "dark" ? "bg-gray-400" : "bg-gray-500"} w-2 h-2 rounded-full`}
                      />
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </Stack>
      </div>

      {/* Warning Message */}
      <AnimatePresence>
        {filteredWarning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="max-w-2xl mx-auto w-full px-4 mb-2"
          >
            <div className={`${theme === "dark" ? "bg-yellow-500/20 border-yellow-500/40" : "bg-yellow-500/20 border-yellow-500/40"} border rounded-lg p-2 text-center`}>
              <Text className={`${theme === "dark" ? "text-yellow-300" : "text-yellow-700"} text-xs`}>
                ⚠️ Names were filtered from your message!
              </Text>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-t px-4 py-4 shadow-lg`}
      >
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className={`flex-1 font-mono rounded-xl border px-4 py-3 text-sm focus:border-blue-500 focus:outline-none ${theme === "dark"
              ? "border-gray-600 bg-gray-700 text-white"
              : "border-gray-300 bg-white text-black"
              }`}
            maxLength={500}
            disabled={timeLeft === 0}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!inputText.trim() || timeLeft === 0}
            className={`px-6 py-3 rounded-xl font-mono font-bold transition ${inputText.trim() && timeLeft > 0
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : `${theme === "dark" ? "bg-gray-700 text-gray-500" : "bg-gray-300 text-gray-500"} cursor-not-allowed`
              }`}
          >
            Send
          </motion.button>
        </div>

        {/* Character Counter */}
        <div className="max-w-2xl mx-auto mt-2 flex items-center justify-between px-2">
          <Text className={`text-xs opacity-50 ${theme === "dark" ? "text-white" : "text-black"}`}>
            💡 Avoid saying names - they'll be filtered!
          </Text>
          <Text className={`text-xs opacity-50 ${theme === "dark" ? "text-white" : "text-black"}`}>
            {inputText.length}/500
          </Text>
        </div>
      </motion.div>
    </div>
  );
}