import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export const DashBoardContainer = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{
        backgroundColor: darkMode
          ? "var(--color-dark-background)"
          : "var(--color-background)",
      }}
    >
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar darkMode={darkMode} />

        <main
          className="flex-1 overflow-y-auto p-6"
          style={{
            backgroundColor: darkMode
              ? "var(--color-dark-background)"
              : "var(--color-background)",
          }}
        >
          <Outlet context={{ darkMode }} />
        </main>
      </div>
    </div>
  );
};