export default function Stack({ direction = "vertical", gap = 4, className = "", children }) {
  const dirClass = direction === "horizontal" ? "flex-row" : "flex-col";
  
  // Map gap values to Tailwind classes
  const gapClasses = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
  };
  
  return (
    <div className={`flex ${dirClass} ${gapClasses[gap] || "gap-4"} ${className}`}>
      {children}
    </div>
  );
}