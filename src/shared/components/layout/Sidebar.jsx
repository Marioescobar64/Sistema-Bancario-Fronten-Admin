import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import bankIcon from '../../../assets/icons/dollar-sign.svg';
import cardIcon from '../../../assets/icons/credit-card.svg';
import sendIcon from '../../../assets/icons/send.svg';
import chartIcon from '../../../assets/icons/bar-chart.svg';
import userIcon from '../../../assets/icons/user.svg';
import fileIcon from '../../../assets/icons/file.svg';
import alertIcon from '../../../assets/icons/alert-triangle.svg';
import lockIcon from '../../../assets/icons/lock.svg';

export const Sidebar = ({ darkMode = false }) => {
  const location = useLocation();

  const items = [
    { label: "Cuentas", to: "/dashboard/accounts", icon: bankIcon },
    { label: "Tarjetas", to: "/dashboard/cards", icon: cardIcon },
    { label: "Transferencias", to: "/dashboard/transfers", icon: sendIcon },
    { label: "Préstamos", to: "/dashboard/loans", icon: chartIcon },
    { label: "Usuarios", to: "/dashboard/users", icon: userIcon },
    { label: "Registros de Auditoría", to: "/dashboard/audit-logs", icon: fileIcon },
    { label: "Movimientos Sospechosos", to: "/dashboard/suspicious-movements", icon: alertIcon },
  ];

  return (
    <aside
      className="w-64 min-h-[calc(100vh-5rem)] p-4 transition-colors duration-500 overflow-y-auto"
      style={{
        backgroundColor: darkMode
          ? "var(--color-dark-surface)"
          : "var(--color-surface)",
        borderRight: `1px solid ${
          darkMode ? "var(--color-dark-border)" : "var(--color-border)"
        }`,
      }}
    >
      {/* Header sidebar */}
      <div className="mb-6 px-2">
        <h2
          className="text-sm font-semibold tracking-wide uppercase"
          style={{
            color: darkMode
              ? "var(--color-dark-text-secondary)"
              : "var(--color-text-secondary)",
          }}
        >
          Menú Principal
        </h2>
      </div>

      {/* Items */}
      <ul className="space-y-2">
        {items.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <li key={item.label}>
              <Link
                to={item.to}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all duration-300 transform hover:scale-[1.02]"
                style={{
                  backgroundColor: isActive
                    ? darkMode
                      ? "rgba(59, 130, 246, 0.15)"
                      : "rgba(37, 99, 235, 0.10)"
                    : "transparent",

                  color: isActive
                    ? darkMode
                      ? "#93c5fd"
                      : "var(--color-primary)"
                    : darkMode
                    ? "var(--color-dark-text-primary)"
                    : "var(--color-text-primary)",

                  borderLeft: isActive
                    ? "3px solid var(--color-primary)"
                    : "3px solid transparent",
                }}
              >
                {/* Icon with dynamic color using filter */}
                <img
                  src={item.icon}
                  className="w-5 h-5 opacity-80"
                  alt={item.label}
                  style={{
                    filter: darkMode
                      ? "invert(1) sepia(1) saturate(5) hue-rotate(180deg)"
                      : "none",
                  }}
                />

                {/* Label */}
                <span className="text-sm font-medium">
                  {item.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-blue-500" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer info */}
      <div className="mt-auto flex justify-center pb-4 pt-4">
        <div
          className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 flex items-center"
          style={{
            backgroundColor: darkMode
              ? "rgba(59, 130, 246, 0.15)"
              : "rgba(37, 99, 235, 0.10)",
            color: darkMode ? "#93c5fd" : "var(--color-primary)",
            border: `1px solid ${
              darkMode
                ? "rgba(59, 130, 246, 0.3)"
                : "rgba(37, 99, 235, 0.2)"
            }`,
          }}
        >
          {/* Imagen a la izquierda del texto */}
          <img
            src={lockIcon}
            alt="Lock icon"
            className="w-5 h-5 mr-2"
          />
          <span>Sistema bancario seguro</span>
        </div>
      </div>
    </aside>
  );
};