import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

/**
 * Componente TableHeader reutilizable
 * @param {Array} columns - Array de {label, key, className}
 * @param {Function} onClick - Callback opcional para ordenar (recibe key)
 */
export const TableHeader = ({ columns, onClick }) => {
  const dm = useDarkMode();

  return (
    <thead 
      style={{ 
        background: dm 
          ? 'linear-gradient(135deg, rgba(31,78,121,0.15) 0%, rgba(27,79,114,0.1) 100%)'
          : 'linear-gradient(135deg, rgba(31,78,121,0.08) 0%, rgba(59,130,246,0.05) 100%)',
        borderBottom: `2px solid ${dm ? 'rgba(93,173,226,0.2)' : 'rgba(31,78,121,0.15)'}`
      }}
    >
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className={`text-left px-6 py-4 md:px-4 md:py-3 font-bold text-xs uppercase tracking-wider ${col.className || ''}`}
            onClick={() => onClick?.(col.key)}
            style={{ 
              cursor: onClick ? 'pointer' : 'default',
              color: dm ? 'var(--color-dark-primary)' : 'var(--color-primary)',
              transition: 'all 200ms ease'
            }}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};
