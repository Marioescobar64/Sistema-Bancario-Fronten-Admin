import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { getSurfaceStyle, getInputStyle } from '../utils/styleHelpers';

/**
 * Componente SearchFilter reutilizable
 * @param {string} value - Valor actual del búsqueda
 * @param {Function} onChange - Callback cuando cambia el valor
 * @param {string} placeholder - Placeholder del input
 * @param {React.ReactNode} children - Elementos adicionales (filters, buttons)
 */
export const SearchFilter = ({ 
  value, 
  onChange, 
  placeholder = 'Buscar...',
  children 
}) => {
  const dm = useDarkMode();

  return (
    <div
      className="rounded-xl shadow-sm p-6 mb-6 md:p-4 md:mb-4 transition-colors duration-300"
      style={getSurfaceStyle(dm)}
    >
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg focus:outline-none"
          style={getInputStyle(dm)}
        />
        {children}
      </div>
    </div>
  );
};
