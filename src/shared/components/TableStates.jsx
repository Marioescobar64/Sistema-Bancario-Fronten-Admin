import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { getSecondaryTextStyle } from '../utils/styleHelpers';

/**
 * Componente LoadingSpinner reutilizable
 * @param {string} message - Mensaje a mostrar
 * @param {number} colSpan - Número de columnas (para colspan en tabla)
 */
export const LoadingSpinner = ({ message = 'Cargando...', colSpan = 6 }) => {
  const dm = useDarkMode();

  return (
    <tr>
      <td 
        colSpan={colSpan} 
        className="px-6 py-12 md:px-4 md:py-8 text-center"
        style={getSecondaryTextStyle(dm)}
      >
        {message}
      </td>
    </tr>
  );
};

/**
 * Componente EmptyState reutilizable
 * @param {string} message - Mensaje a mostrar
 * @param {number} colSpan - Número de columnas (para colspan en tabla)
 */
export const EmptyState = ({ message = 'No hay datos para mostrar.', colSpan = 6 }) => {
  const dm = useDarkMode();

  return (
    <tr>
      <td 
        colSpan={colSpan} 
        className="px-6 py-12 md:px-4 md:py-8 text-center"
        style={getSecondaryTextStyle(dm)}
      >
        {message}
      </td>
    </tr>
  );
};
