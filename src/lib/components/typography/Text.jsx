export default function Text({ children, className = "" }) {
  return <p className={`font-mono text-base ${className}`}>{children}</p>;
}
