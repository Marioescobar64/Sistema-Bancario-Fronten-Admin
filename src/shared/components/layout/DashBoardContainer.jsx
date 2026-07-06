import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export const DashBoardContainer = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{
        backgroundColor: darkMode
          ? "var(--color-dark-background)"
          : "var(--color-background)",
      }}
    >
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        <Sidebar darkMode={darkMode} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

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