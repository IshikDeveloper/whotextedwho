// src/App.jsx
import { useState } from "react";

export default function Welcome() {
  const [theme, setTheme] = useState("dark");
  const [bubble, setBubble] = useState("blue");
  const [name, setName] = useState("");

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className={`${theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-gray-900"} 
                     min-h-screen flex flex-col items-center justify-center transition-all`}>
      <div className="w-full max-w-sm p-6 rounded-2xl shadow-lg 
                      bg-opacity-80 backdrop-blur-lg border border-gray-700">
        <h1 className="text-3xl font-mono text-center mb-6">
          WHO TEXTED WHAT?
        </h1>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-mono mb-2">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded-lg bg-transparent border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder="Enter your name..."
          />
        </div>

        {/* Bubble Picker */}
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setBubble("blue")}
            className={`px-3 py-2 rounded-lg font-mono transition-all 
              ${bubble === "blue" ? "bg-blue-500 text-white" : "bg-gray-700 hover:bg-blue-500 hover:text-white"}`}
          >
            🟦 Blue
          </button>
          <button
            onClick={() => setBubble("green")}
            className={`px-3 py-2 rounded-lg font-mono transition-all 
              ${bubble === "green" ? "bg-green-500 text-white" : "bg-gray-700 hover:bg-green-500 hover:text-white"}`}
          >
            🟩 Green
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="mb-6 flex justify-between items-center">
          <span className="font-mono text-sm">Theme</span>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 font-mono"
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 font-mono text-white">
            Create Game
          </button>
          <button className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 font-mono text-white">
            Join Game
          </button>
        </div>

        {/* Samsungphobia Footer 
        <p className="text-center text-xs font-mono mt-6 opacity-70">
          Samsungphobia Mode Active 💚🚫
        </p>
        */}
      </div>
    </div>
  );
}
