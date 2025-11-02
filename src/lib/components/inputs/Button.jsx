import { motion } from "framer-motion";

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  theme,
  disabled = false,
}) {
  const base =
    "font-mono rounded-xl px-4 py-2 transition-colors duration-200 focus:outline-none";
  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };
  const variants = {
    primary:
      `bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700`,
    ghost:
      `bg-transparent border border-gray-400 text-${theme === "dark" ? "white" : "black"} hover:${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`,
    outline:
      `border border-gray-600 text-${theme === "dark" ? "white" : "black"} hover:${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`,
  };

  const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${
        disabled ? disabledStyles : ""
      } ${className}`}
    >
      {children}
    </motion.button>
  );
}