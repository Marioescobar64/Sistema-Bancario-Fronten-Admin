import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useState, useEffect } from "react";
import bgImage from "../../../assets/img/background.png";

export const DashBoardContainer = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? 'bg-[var(--color-dark-background)]' : 'bg-[var(--color-background)]'}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar darkMode={darkMode} />

        <main className="flex-1 p-8 overflow-y-auto">
          {/* Card de Contenido Principal */}
          <div className={`min-h-full rounded-3xl p-8 border transition-all duration-300 shadow-sm
            ${darkMode 
              ? 'bg-[var(--color-dark-surface)] border-[var(--color-dark-border)]' 
              : 'bg-[var(--color-surface)] border-[var(--color-border)]'}`}>
            
            <header className="mb-6">
               <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-[var(--color-text-primary)]'}`}>
                 Resumen de Cuentas
               </h2>
               <p className="text-[var(--color-text-secondary)] text-sm">Bienvenido de nuevo, Administrador.</p>
            </header>

            <div className="border-2 border-dashed border-[var(--color-border)] rounded-2xl h-64 flex items-center justify-center text-gray-400">
               Contenido del Dashboard
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};