import logoLight from "../../../assets/img/veraff-light.png";
import logoDark from "../../../assets/img/veraff-dark.png";

export const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <nav
      className={`sticky top-0 z-50 h-20 px-8 flex items-center justify-between border-b transition-all duration-500 backdrop-blur-md
      ${darkMode 
        ? 'bg-[var(--color-dark-background)]/80 border-[var(--color-dark-border)]' 
        : 'bg-white/80 border-[var(--color-border)]'}`}
    >
      {/* 🏦 BRAND SECTION */}
      <div className="flex items-center gap-4">
        <img
          src={darkMode ? logoDark : logoLight}
          alt="Bank Logo"
          className="h-10 w-auto transition-transform duration-300 hover:scale-105"
        />
        
        <div className="hidden sm:block border-l pl-4 border-slate-300 dark:border-slate-700">
          <h1 className={`font-bold text-lg tracking-tight leading-none ${darkMode ? 'text-white' : 'text-[var(--color-text-primary)]'}`}>
            Kinal Bank
          </h1>
          <p className="text-[10px] uppercase tracking-[0.15em] opacity-60 font-medium mt-1">
            Banca Digital
          </p>
        </div>
      </div>

      {/* ⚡ CONTROLES Y PERFIL */}
      <div className="flex items-center gap-3 sm:gap-6">
        
        {/* Toggle Dark Mode (Estilo Minimalista) */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2.5 rounded-xl border transition-all hover:shadow-sm active:scale-95
            ${darkMode 
              ? 'bg-slate-800 border-slate-700 text-yellow-400' 
              : 'bg-slate-50 border-slate-200 text-slate-600'}`}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* Notificaciones */}
        <button className="relative p-2.5 text-xl opacity-70 hover:opacity-100 transition-opacity">
          🔔
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        {/* Separador Visual */}
        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden xs:block"></div>

        {/* Perfil de Usuario */}
        <div className="flex items-center gap-3 group cursor-pointer pl-2">
          <div className="text-right hidden md:block">
            <p className={`text-xs font-bold leading-none ${darkMode ? 'text-white' : 'text-[var(--color-text-primary)]'}`}>
              Administrador
            </p>
            <p className="text-[10px] text-green-500 font-semibold mt-1 flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Online
            </p>
          </div>
          
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              A
            </div>
            {/* Indicador de status en móvil */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full md:hidden"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};