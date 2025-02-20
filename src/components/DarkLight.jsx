import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
const DarkLight = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
      );
    
      useEffect(() => {
        const root = window.document.documentElement;
        if (theme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
      }, [theme]);
    
      const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
      };
    
      return (
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 p-2 rounded  text-black dark:text-pink-600 transition"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <>
              <FaMoon />
            </>
          ) : (
            <>
           
              <FaSun /> 
            </>
          )}
        </button>
      );
};

export default DarkLight;