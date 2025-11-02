import { motion } from "framer-motion";

export default function TextBubble({
  children,
  color = "blue",
  side = "left",
  className = "",
}) {
  const isLeft = side === "left";

  // Function to get bubble styles based on color
  const getBubbleStyle = () => {
    switch(color) {
      // Basic colors
      case "green":
        return "bg-green-500 text-white";
      case "blue":
        return "bg-blue-500 text-white";
      
      // 🌈 Secret code themes
      case "rainbow":
        return "bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 text-white font-bold animate-gradient-shift";
      
      case "gold":
        return "bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-600 text-black font-bold shadow-lg shadow-yellow-500/50 animate-shimmer";
      
      case "fire":
        return "bg-gradient-to-t from-red-600 via-orange-500 to-yellow-500 text-white font-bold animate-pulse shadow-lg shadow-orange-500/50";
      
      case "ice":
        return "bg-gradient-to-b from-cyan-300 via-blue-400 to-blue-600 text-white font-bold shadow-lg shadow-cyan-400/50 backdrop-blur-sm";
      
      case "galaxy":
        return "bg-gradient-to-br from-purple-900 via-blue-800 to-pink-800 text-white font-bold shadow-xl shadow-purple-500/50 animate-twinkle";
      
      // 💻 Developer-only secret theme
      case "matrix":
        return "bg-black text-green-400 border-2 border-green-500/50 shadow-[0_0_25px_rgba(34,197,94,0.6)] font-mono tracking-wider animate-pulse-glow";
      
      default:
        return "bg-gray-300 text-black dark:bg-gray-700 dark:text-white";
    }
  };

  // Get tail color for special themes
  const getTailColor = () => {
    switch(color) {
      case "rainbow":
        return "border-b-purple-500";
      case "gold":
        return "border-b-amber-600";
      case "fire":
        return "border-b-orange-500";
      case "ice":
        return "border-b-blue-500";
      case "galaxy":
        return "border-b-purple-800";
      case "matrix":
        return "border-b-green-500";
      case "green":
        return "border-b-green-500";
      default:
        return "border-b-blue-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isLeft ? "justify-start" : "justify-end"} w-full`}
    >
      <div
        className={`relative max-w-[75%] px-4 py-2 rounded-2xl ${getBubbleStyle()} ${className}`}
      >
        {children}
        {/* Bubble tail */}
        <div
          className={`absolute bottom-0 ${
            isLeft
              ? "-left-1 border-l-[8px] border-l-transparent border-b-[8px]"
              : "-right-1 border-r-[8px] border-r-transparent border-b-[8px]"
          } ${getTailColor()}`}
        />
      </div>
    </motion.div>
  );
}