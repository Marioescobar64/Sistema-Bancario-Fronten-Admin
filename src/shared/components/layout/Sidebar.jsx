import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  {
    label: "Cuentas",
    to: "/dashboard/accounts",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
  },
  {
    label: "Tarjetas",
    to: "/dashboard/cards",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    label: "Transferencias",
    to: "/dashboard/transfers",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    ),
  },
  {
    label: "Préstamos",
    to: "/dashboard/loans",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    label: "Usuarios",
    to: "/dashboard/users",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: "Auditoría",
    to: "/dashboard/audit-logs",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    ),
  },
  {
    label: "Mov. Sospechosos",
    to: "/dashboard/suspicious-movements",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    alert: true,
  },
];

export const Sidebar = ({ darkMode = false }) => {
  const location = useLocation();
  const dm = darkMode;

  return (
    <aside
      className="w-56 min-h-[calc(100vh-4rem)] flex flex-col transition-colors duration-300"
      style={{
        backgroundColor: dm ? "var(--color-dark-surface)" : "var(--color-surface)",
        borderRight: `1px solid ${dm ? "var(--color-dark-border)" : "var(--color-border)"}`,
      }}
    >
      {/* Sección de navegación */}
      <nav className="flex-1 py-5 px-3">
        <p
          className="text-[9px] font-bold uppercase tracking-[0.16em] px-3 mb-3"
          style={{ color: dm ? "var(--color-dark-text-secondary)" : "var(--color-text-secondary)" }}
        >
          Navegación
        </p>

        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
                  style={{
                    backgroundColor: isActive
                      ? dm ? "rgba(93,173,226,0.12)" : "rgba(31,78,121,0.08)"
                      : "transparent",
                    color: isActive
                      ? dm ? "var(--color-dark-primary)" : "var(--color-primary)"
                      : dm ? "var(--color-dark-text-primary)" : "var(--color-text-primary)",
                    borderLeft: isActive
                      ? `2px solid ${dm ? "var(--color-dark-primary)" : "var(--color-primary)"}`
                      : "2px solid transparent",
                    borderRadius: isActive ? "0 8px 8px 0" : "8px",
                    fontWeight: isActive ? "600" : "400",
                  }}
                >
                  <span
                    style={{
                      color: isActive
                        ? dm ? "var(--color-dark-primary)" : "var(--color-primary)"
                        : dm ? "var(--color-dark-text-secondary)" : "var(--color-text-secondary)",
                    }}
                  >
                    {item.icon}
                  </span>

                  <span className="text-[13px] flex-1 leading-none">{item.label}</span>

                  {item.alert && !isActive && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "var(--color-error)" }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-4"
        style={{ borderTop: `1px solid ${dm ? "var(--color-dark-border)" : "var(--color-border)"}` }}
      >
        <div className="flex items-center gap-2">
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke={dm ? "var(--color-dark-primary)" : "var(--color-primary)"}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span
            className="text-[10px]"
            style={{ color: dm ? "var(--color-dark-text-secondary)" : "var(--color-text-secondary)" }}
          >
            Conexión SSL · 256-bit
          </span>
        </div>
      </div>
    </aside>
  );
};