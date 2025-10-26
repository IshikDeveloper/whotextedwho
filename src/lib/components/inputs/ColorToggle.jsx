export default function ColorToggle({ value, onChange }) {
  return (
    <div className="flex gap-2 font-mono">
      <button
        onClick={() => onChange("blue")}
        className={`px-3 py-1.5 rounded-md transition ${
          value === "blue"
            ? "bg-blue-500 text-white"
            : "border border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300"
        }`}
      >
        🟦 Blue
      </button>
      <button
        onClick={() => onChange("green")}
        className={`px-3 py-1.5 rounded-md transition ${
          value === "green"
            ? "bg-green-500 text-white"
            : "border border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300"
        }`}
      >
        🟩 Green
      </button>
    </div>
  );
}
