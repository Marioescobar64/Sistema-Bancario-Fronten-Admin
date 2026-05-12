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
        backgroundColor: dm 
          ? 'rgba(27,79,114,0.25)' 
          : 'rgba(214,234,248,0.55)' 
      }}
    >
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className={`text-left px-6 py-4 md:px-4 md:py-3 font-semibold ${col.className || ''}`}
            onClick={() => onClick?.(col.key)}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};
