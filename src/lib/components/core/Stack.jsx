export default function Stack({ direction = "vertical", gap = 4, className = "", children }) {
  const dirClass = direction === "horizontal" ? "flex-row" : "flex-col";
  return <div className={`flex ${dirClass} gap-${gap} ${className}`}>{children}</div>;
}
