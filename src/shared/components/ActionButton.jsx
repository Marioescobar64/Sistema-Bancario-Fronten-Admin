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
        color: 'white'
      },
      'danger': {
        backgroundColor: dm ? 'rgba(236,112,99,0.18)' : '#FEE2E2',
        color: dm ? '#F5B7B1' : '#B91C1C'
      },
      'success': {
        backgroundColor: dm ? 'rgba(39,174,96,0.18)' : '#DCFCE7',
        color: dm ? 'var(--color-dark-success)' : '#15803D'
      },
      'secondary': {
        backgroundColor: dm ? '#0B1C2C' : '#FFFFFF',
        color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)',
        border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`
      },
      'blue': {
        backgroundColor: '#2563EB',
        color: 'white'
      }
    };
    return baseStyle[variant] || baseStyle.secondary;
  };

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-block disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={getStyle()}
    >
      {loading ? 'Cargando...' : label}
    </button>
  );
};
