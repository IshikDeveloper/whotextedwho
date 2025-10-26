export default function TextField({
  value,
  onChange,
  placeholder = "",
  className = "",
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`font-mono w-full rounded-xl border border-gray-400 bg-transparent px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:text-white ${className}`}
    />
  );
}
