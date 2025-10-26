export default function Heading({ level = 1, children, className = "" }) {
  const Tag = `h${level}`;
  const size =
    level === 1
      ? "text-3xl font-bold"
      : level === 2
      ? "text-2xl font-semibold"
      : "text-xl font-medium";

  return <Tag className={`font-mono ${size} ${className}`}>{children}</Tag>;
}
