import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useState, useEffect } from "react";
import bgImage from "../../../assets/img/background.png";

// Vista Cuentas
import { Accounts } from "../../../features/accounts/components/accounts";

export const DashBoardContainer = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? 'bg-[var(--color-dark-background)]' : 'bg-[var(--color-background)]'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar darkMode={darkMode} />

        <main className="flex-1 p-8 overflow-y-auto">
          <Accounts darkMode={darkMode} /> 
          
        </main>
      </div>
    </div>
  );
};