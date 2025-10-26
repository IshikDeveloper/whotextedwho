import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./lib"
import WhoTextedWhatGame from "./WhoTextedWhatGame";

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WhoTextedWhatGame/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}
