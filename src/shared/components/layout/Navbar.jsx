import { useAuthStore } from "../../../features/auth/authStore.js";
import { useNavigate } from "react-router-dom";
import logoLight from "../../../assets/img/veraff-light-icon.png";
import logoDark from "../../../assets/img/veraff-dark-icon.png";

export const Navbar = ({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const dm = darkMode;

  return (
    <nav
      className="sticky top-0 z-50 h-16 px-4 md:px-6 flex items-center justify-between transition-colors duration-300"
      style={{
        backgroundColor: dm ? "var(--color-dark-surface)" : "var(--color-surface)",
        borderBottom: `1px solid ${dm ? "var(--color-dark-border)" : "var(--color-border)"}`,
      }}
    >
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 mr-2"
        style={{
          backgroundColor: dm ? "var(--color-dark-background)" : "var(--color-background)",
          border: `1px solid ${dm ? "var(--color-dark-border)" : "var(--color-border)"}`,
          color: dm ? "var(--color-dark-text-secondary)" : "var(--color-text-secondary)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {sidebarOpen ? (
            <g>
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </g>
          ) : (
            <g>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </g>
          )}
        </svg>
      </button>

      {/* BRAND */}
      <div className="flex items-center gap-4">
        <img
          src={dm ? logoDark : logoLight}
          alt="Veraff Bank"
          className="h-8 w-auto"
        />
        <div
          className="hidden sm:block w-px h-6"
          style={{ backgroundColor: dm ? "var(--color-dark-border)" : "var(--color-border)" }}
        />
        <div className="hidden sm:block">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.12em] leading-none"
            style={{ color: dm ? "var(--color-dark-text-primary)" : "var(--color-text-primary)" }}
          >
            Veraff Bank
          </p>
          <p
            className="text-[9px] uppercase tracking-[0.18em] mt-0.5"
            style={{ color: dm ? "var(--color-dark-text-secondary)" : "var(--color-text-secondary)" }}
          >
            Banca Digital
          </p>
        </div>
      </div>

      {/* CONTROLES */}
      <div className="flex items-center gap-2">

        {/* Toggle Dark Mode */}
        <button
          onClick={() => setDarkMode(!dm)}
          title={dm ? "Modo claro" : "Modo oscuro"}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: dm ? "var(--color-dark-background)" : "var(--color-background)",
            border: `1px solid ${dm ? "var(--color-dark-border)" : "var(--color-border)"}`,
            color: dm ? "var(--color-dark-primary)" : "var(--color-primary)",
          }}
        >
          {dm ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        {/* Notificaciones */}
        <button
          className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            backgroundColor: dm ? "var(--color-dark-background)" : "var(--color-background)",
            border: `1px solid ${dm ? "var(--color-dark-border)" : "var(--color-border)"}`,
            color: dm ? "var(--color-dark-text-secondary)" : "var(--color-text-secondary)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "var(--color-error)" }}
          />
        </button>

        {/* Separador */}
        <div
          className="w-px h-6 mx-1"
          style={{ backgroundColor: dm ? "var(--color-dark-border)" : "var(--color-border)" }}
        />

        {/* Perfil */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:block text-right">
            <p
              className="text-xs font-semibold leading-none"
              style={{ color: dm ? "var(--color-dark-text-primary)" : "var(--color-text-primary)" }}
            >
              Administrador
            </p>
            <p
              className="text-[10px] mt-0.5"
              style={{ color: dm ? "var(--color-dark-text-secondary)" : "var(--color-text-secondary)" }}
            >
              admin@veraff.com
            </p>
          </div>

          <div className="relative">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: dm ? "var(--color-dark-primary)" : "var(--color-primary)",
                color: dm ? "#0B1C2C" : "white",
              }}
            >
              A
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
              style={{
                backgroundColor: "var(--color-success)",
                borderColor: dm ? "var(--color-dark-surface)" : "var(--color-surface)",
              }}
            />
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: dm ? "var(--color-dark-background)" : "var(--color-background)",
              border: `1px solid ${dm ? "var(--color-dark-border)" : "var(--color-border)"}`,
              color: dm ? "var(--color-dark-text-secondary)" : "var(--color-text-secondary)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};