import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { getStatusBadgeStyle } from '../utils/styleHelpers';

/**
 * Componente StatusBadge reutilizable
 * @param {boolean} isActive - Si está activo o no
 * @param {string} activeLabel - Etiqueta cuando está activo
 * @param {string} inactiveLabel - Etiqueta cuando está inactivo
 */
export const StatusBadge = ({ 
  isActive, 
  activeLabel = 'Activo',
  inactiveLabel = 'Inactivo'
}) => {
  const dm = useDarkMode();

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold"
      style={getStatusBadgeStyle(isActive, dm)}
    >
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
};
