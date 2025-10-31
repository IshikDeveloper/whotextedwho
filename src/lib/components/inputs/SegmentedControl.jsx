export default function SegmentedControl({ value, onChange, options }) {
  return (
    <div className="inline-flex border border-gray-400 rounded-2xl overflow-hidden font-mono">
      {options.map((option) => (
        <div
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-5 py-2 cursor-pointer transition ${
            value === option.value
              ? "bg-blue-500 text-white"
              : "bg-transparent text-gray-500 dark:text-gray-400"
          }`}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
}