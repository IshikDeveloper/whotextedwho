export default function Container({ className = "", children }) {
  return (
    <div
      className={`max-w-md mx-auto px-4 py-6 flex flex-col items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
}
