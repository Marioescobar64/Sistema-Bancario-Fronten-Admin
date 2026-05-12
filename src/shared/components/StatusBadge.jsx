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

  const getStatusStyle = () => {
    if (isActive) {
      return {
        backgroundColor: dm ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.08)',
        color: dm ? '#86efac' : '#15803d',
        border: `1.5px solid ${dm ? 'rgba(34,197,94,0.3)' : 'rgba(34,197,94,0.2)'}`,
        fontWeight: '600',
        fontSize: '0.75rem',
        letterSpacing: '0.5px'
      };
    } else {
      return {
        backgroundColor: dm ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)',
        color: dm ? '#fca5a5' : '#dc2626',
        border: `1.5px solid ${dm ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.2)'}`,
        fontWeight: '600',
        fontSize: '0.75rem',
        letterSpacing: '0.5px'
      };
    }
  };

  return (
    <span
      className="px-3 py-1.5 md:px-2 md:py-1 rounded-full inline-flex items-center gap-1.5 transition-all duration-200"
      style={getStatusStyle()}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{
        backgroundColor: isActive ? (dm ? '#86efac' : '#15803d') : (dm ? '#fca5a5' : '#dc2626')
      }} />
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
};
