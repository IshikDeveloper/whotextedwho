// src/utils/bubbleColors.js

/**
 * Get the appropriate bubble preview/avatar style for a bubble color
 * Used in lobby, results, and other screens where we show small bubble indicators
 */
export function getBubbleAvatarStyle(color) {
  switch(color) {
    case "green":
      return "bg-green-500";
    case "blue":
      return "bg-blue-500";
    case "rainbow":
      return "bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 animate-gradient-shift bg-[length:200%_200%]";
    case "gold":
      return "bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-600 animate-shimmer";
    case "fire":
      return "bg-gradient-to-t from-red-600 via-orange-500 to-yellow-500 animate-pulse";
    case "ice":
      return "bg-gradient-to-b from-cyan-300 via-blue-400 to-blue-600 shadow-sm shadow-cyan-400/30";
    case "galaxy":
      return "bg-gradient-to-br from-purple-900 via-blue-800 to-pink-800 animate-twinkle";
    case "matrix":
      return "bg-black border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse-glow";
    default:
      return "bg-gray-400";
  }
}

/**
 * Get emoji indicator for special bubble types
 * Returns null for basic colors
 */
export function getBubbleEmoji(color) {
  switch(color) {
    case "rainbow":
      return "🌈";
    case "gold":
      return "✨";
    case "fire":
      return "🔥";
    case "ice":
      return "❄️";
    case "galaxy":
      return "🌌";
    case "matrix":
      return "💻";
    default:
      return null;
  }
}

/**
 * Check if a bubble color is a special/unlockable theme
 */
export function isSpecialBubble(color) {
  return ["rainbow", "gold", "fire", "ice", "galaxy", "matrix"].includes(color);
}