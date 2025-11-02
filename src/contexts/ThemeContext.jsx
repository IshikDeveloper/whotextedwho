import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    
    // Otherwise check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches 
      ? "dark" 
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove opposite theme
    root.classList.remove(theme === "dark" ? "light" : "dark");
    
    // Add current theme
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const setDarkTheme = () => setTheme("dark");
  const setLightTheme = () => setTheme("light");

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        toggleTheme,
        setDarkTheme,
        setLightTheme,
        isDark: theme === "dark",
        isLight: theme === "light"
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}