import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TextBubble } from "./lib";

export default function MatchmakingLobby({ user, bubbleColor }) {
  const greetings = [
    "Hello",
    "Hi",
    "Yellow",
    "Blue",
    "I'm in Lake Chargogogogoggman and I got diagnosed with pneumonoultramicroscopicsilicovolcanoconiosis",
    "Alessio!"
  ];

  const [greeting, setGreeting] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 gap-6 text-center font-mono">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <TextBubble color={bubbleColor}>
          {`${greeting}, john!`}
        </TextBubble>
      </motion.div>

      {/* Custom segmented switch */}
      <div className="flex border border-gray-500 rounded-2xl overflow-hidden text-sm select-none">
        <div
          className={`px-6 py-2 cursor-pointer transition-colors ${
            isPublic
              ? "bg-blue-500 text-white"
              : "bg-transparent text-gray-400 hover:bg-gray-700/20"
          }`}
          onClick={() => setIsPublic(true)}
        >
          Public
        </div>
        <div
          className={`px-6 py-2 cursor-pointer transition-colors ${
            !isPublic
              ? "bg-blue-500 text-white"
              : "bg-transparent text-gray-400 hover:bg-gray-700/20"
          }`}
          onClick={() => setIsPublic(false)}
        >
          Private
        </div>
      </div>

      {/* Status text */}
      <div className="mt-4 text-sm text-gray-500">
        {isPublic ? "Public matchmaking enabled." : "Enter code to join private match:"}
      </div>

      {/* Placeholder for code link / code input */}
      <div className="mt-2 p-2 border border-gray-700 rounded-lg w-48 text-gray-400 text-sm">
        (code link will appear here)
      </div>
    </div>
  );
}
