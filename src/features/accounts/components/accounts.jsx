import React from 'react';

const AccountCard = ({ darkMode, id, type, balance, isActive, owner }) => {
  const isDark = darkMode;
  
  return (
    <div className={`
      relative group p-6 rounded-2xl border transition-all duration-400
      ${isDark 
        ? "bg-[var(--color-dark-surface)] border-[var(--color-dark-border)] hover:border-[var(--color-dark-secondary)]" 
        : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-secondary)]"}
      hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]
    `}>
      {/* Indicador de Estado Sutil */}
      <div className={`absolute top-6 right-6 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
        ${isActive 
          ? (isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600")
          : (isDark ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-600")}
      `}>
        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
        {isActive ? "Operativa" : "Suspendida"}
      </div>

      <div className="flex flex-col h-full">
        {/* Información de Identificación */}
        <div className="mb-8">
          <p className={`text-[10px] uppercase tracking-[0.15em] font-bold mb-1 opacity-60
            ${isDark ? "text-[var(--color-dark-text-secondary)]" : "text-[var(--color-text-secondary)]"}`}>
            Número de Cuenta
          </p>
          <h2 className={`text-lg font-mono font-medium tracking-tight ${isDark ? "text-[var(--color-dark-text-primary)]" : "text-[var(--color-text-primary)]"}`}>
            **** {id.slice(-4)}
          </h2>
          <span className={`text-xs mt-1 block font-medium ${isDark ? "text-blue-400" : "text-blue-600"}`}>
            {type}
          </span>
        </div>

        {/* Balance con jerarquía visual clara */}
        <div className="mb-8">
          <p className={`text-[10px] uppercase tracking-[0.15em] font-bold mb-1 opacity-60
            ${isDark ? "text-[var(--color-dark-text-secondary)]" : "text-[var(--color-text-secondary)]"}`}>
            Saldo Disponible
          </p>
          <div className="flex items-baseline gap-1">
            <span className={`text-sm font-semibold ${isDark ? "text-[var(--color-dark-text-secondary)]" : "text-[var(--color-text-secondary)]"}`}>Q</span>
            <span className={`text-3xl font-light tracking-tight ${isDark ? "text-[var(--color-dark-text-primary)]" : "text-[var(--color-text-primary)]"}`}>
              {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Acciones de baja fricción */}
        <div className="mt-auto pt-4 flex gap-4 border-t border-gray-100 dark:border-gray-800">
          <button className={`text-xs font-bold uppercase tracking-widest hover:opacity-100 transition-opacity opacity-70
            ${isDark ? "text-[var(--color-dark-primary)]" : "text-[var(--color-primary)]"}`}>
            Detalles
          </button>
          <button className={`text-xs font-bold uppercase tracking-widest hover:opacity-100 transition-opacity opacity-70
            ${isDark ? "text-[var(--color-dark-text-secondary)]" : "text-[var(--color-text-secondary)]"}`}>
            Ajustes
          </button>
        </div>
      </div>
    </div>
  );
};

export const Accounts = ({ darkMode = false }) => {
  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans
      ${darkMode ? "bg-[var(--color-dark-background)]" : "bg-[var(--color-background)]"}`}>
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Minimalista */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className={`text-2xl font-semibold tracking-tight ${darkMode ? "text-white" : "text-[var(--color-text-primary)]"}`}>
              Cuentas
            </h1>
            <p className={`text-sm mt-1 font-medium opacity-60 ${darkMode ? "text-[var(--color-dark-text-secondary)]" : "text-[var(--color-text-secondary)]"}`}>
              Resumen global de tus activos financieros.
            </p>
          </div>

          <button className={`
            px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all
            ${darkMode 
              ? "bg-[var(--color-dark-primary)] text-[#0B1C2C] hover:bg-white" 
              : "bg-[var(--color-primary)] text-white hover:shadow-lg hover:-translate-y-0.5"}
          `}>
            Aperturar Cuenta
          </button>
        </header>

        {/* Layout de Rejilla Profesional */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AccountCard 
            darkMode={darkMode}
            id="123456789"
            type="Cuenta Corriente"
            balance={15450.00}
            isActive={true}
          />
          <AccountCard 
            darkMode={darkMode}
            id="987654321"
            type="Fondo de Inversión"
            balance={4200.55}
            isActive={true}
          />
          {/* Card para agregar (Estilo Minimalista) */}
          <button className={`
            border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 min-h-[220px] transition-all
            ${darkMode 
              ? "border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-400" 
              : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500"}
          `}>
            <span className="text-2xl mb-2">+</span>
            <span className="text-xs font-bold uppercase tracking-widest">Nueva Cartera</span>
          </button>
        </div>
      </div>
    </div>
  );
};