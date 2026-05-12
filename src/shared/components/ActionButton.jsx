import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

/**
 * Componente ActionButton reutilizable
 * @param {string} label - Texto del botón
 * @param {Function} onClick - Callback al hacer click
 * @param {string} variant - 'primary' | 'danger' | 'success' | 'secondary'
 * @param {boolean} loading - Mostrar estado de cargando
 * @param {boolean} disabled - Desabilitar botón
 */
export const ActionButton = ({ 
  label, 
  onClick, 
  variant = 'secondary',
  loading = false,
  disabled = false,
  className = ''
}) => {
  const dm = useDarkMode();

  const getStyle = () => {
    const baseStyle = {
      'primary': {
        backgroundColor: dm ? 'var(--color-dark-primary)' : 'var(--color-primary)',
        color: 'white',
        border: 'none'
      },
      'danger': {
        backgroundColor: dm ? 'rgba(236,112,99,0.15)' : 'rgba(239,68,68,0.1)',
        color: dm ? '#fca5a5' : '#dc2626',
        border: `1px solid ${dm ? 'rgba(236,112,99,0.3)' : 'rgba(239,68,68,0.2)'}`
      },
      'success': {
        backgroundColor: dm ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)',
        color: dm ? '#86efac' : '#15803d',
        border: `1px solid ${dm ? 'rgba(34,197,94,0.3)' : 'rgba(34,197,94,0.2)'}`
      },
      'secondary': {
        backgroundColor: dm ? 'rgba(15,23,42,0.5)' : 'rgba(59,130,246,0.05)',
        color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)',
        border: `1px solid ${dm ? 'rgba(93,173,226,0.2)' : 'rgba(59,130,246,0.15)'}`
      },
      'blue': {
        backgroundColor: dm ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)',
        color: dm ? '#93c5fd' : '#1e40af',
        border: `1px solid ${dm ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.2)'}`
      }
    };
    return baseStyle[variant] || baseStyle.secondary;
  };

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`px-4 py-2 md:px-3 md:py-1.5 rounded-lg text-xs font-semibold inline-block disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 ${className}`}
      style={getStyle()}
    >
      {loading ? 'Cargando...' : label}
    </button>
  );
};
