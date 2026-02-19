import React, { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDark]);

  return (
    <div className="switch-container">
      <label className="switch">
        <input
          type="checkbox"
          checked={isDark}
          onChange={() => setIsDark(!isDark)}
        />
        <span className="slider"></span>
      </label>
      <span className={isDark ? "mode-dark" : "mode-light"}>
        {isDark ? "Sombre" : "Clair"}
      </span>
    </div>
  );
};

export default ThemeToggle;
