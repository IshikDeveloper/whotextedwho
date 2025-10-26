export default function SegmentedControl({ value, onChange }) {
  return (
    <div className="inline-flex border border-gray-400 rounded-2xl overflow-hidden font-mono">
      <div
        onClick={() => onChange("public")}
        className={`px-5 py-2 cursor-pointer transition ${
          value === "public"
            ? "bg-blue-500 text-white"
            : "bg-transparent text-gray-500 dark:text-gray-400"
        }`}
      >
        Public
      </div>
      <div
        onClick={() => onChange("private")}
        className={`px-5 py-2 cursor-pointer transition ${
          value === "private"
            ? "bg-blue-500 text-white"
            : "bg-transparent text-gray-500 dark:text-gray-400"
        }`}
      >
        Private
      </div>
    </div>
  );
}
