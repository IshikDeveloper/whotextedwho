export default function TextField({
  value,
  onChange,
  placeholder = "",
  className = "",
  maxLength,
  type = "text",
  theme,
  ...props
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`font-mono w-full rounded-xl border border-gray-400 bg-transparent text-${theme === "dark" ? "white" : "black"} px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 ${className}`}
      {...props}
    />
  );
}