import { motion } from "framer-motion";

export default function TextBubble({
  text,
  color = "blue",
  side = "left",
  className = "",
}) {
  const isLeft = side === "left";

  const bubbleColor =
    color === "green"
      ? "bg-green-500 text-white"
      : color === "blue"
      ? "bg-blue-500 text-white"
      : "bg-gray-300 text-black dark:bg-gray-700 dark:text-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isLeft ? "justify-start" : "justify-end"} w-full`}
    >
      <div
        className={`relative max-w-[75%] px-4 py-2 rounded-2xl font-mono ${bubbleColor} ${className}`}
      >
        {text}
        {/* Bubble tail */}
        <div
          className={`absolute bottom-0 ${
            isLeft
              ? "-left-1 border-l-[8px] border-l-transparent border-b-[8px]"
              : "-right-1 border-r-[8px] border-r-transparent border-b-[8px]"
          } ${color === "green" ? "border-b-green-500" : "border-b-blue-500"}`}
        />
      </div>
    </motion.div>
  );
}
