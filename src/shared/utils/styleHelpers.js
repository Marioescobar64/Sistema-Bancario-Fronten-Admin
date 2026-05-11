/**
 * Utilidades para generar estilos con darkMode
 */

/**
 * Estilo genérico para superficie (card)
 */
export const getSurfaceStyle = (dm) => ({
  backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)',
  border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`
});

/**
 * Estilo para input
 */
export const getInputStyle = (dm) => ({
  backgroundColor: dm ? '#0B1C2C' : '#F4F7FB',
  color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)',
  border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`,
  outline: 'none'
});

/**
 * Estilo para botón primario (crear/guardar)
 */
export const getPrimaryButtonStyle = (dm) => ({
  backgroundColor: dm ? 'var(--color-dark-success)' : 'var(--color-success)',
  color: 'white'
});

/**
 * Estilo para botón secundario
 */
export const getSecondaryButtonStyle = (dm) => ({
  backgroundColor: dm ? '#0B1C2C' : '#FFFFFF',
  color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)',
  border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`
});

/**
 * Estilo para texto principal
 */
export const getPrimaryTextStyle = (dm) => ({
  color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)'
});

/**
 * Estilo para texto secundario
 */
export const getSecondaryTextStyle = (dm) => ({
  color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)'
});

/**
 * Estilo para badge activo
 */
export const getActiveBadgeStyle = (dm) => ({
  backgroundColor: dm ? 'rgba(39,174,96,0.18)' : '#DCFCE7',
  color: dm ? 'var(--color-dark-success)' : '#15803D'
});

/**
 * Estilo para badge inactivo
 */
export const getInactiveBadgeStyle = (dm) => ({
  backgroundColor: dm ? 'rgba(169,204,227,0.14)' : '#E5E7EB',
  color: dm ? 'var(--color-dark-text-secondary)' : '#4B5563'
});

/**
 * Estilo para error/desactivar
 */
export const getErrorBadgeStyle = (dm) => ({
  backgroundColor: dm ? 'rgba(236,112,99,0.18)' : '#FEE2E2',
  color: dm ? '#F5B7B1' : '#B91C1C'
});

/**
 * Estilo para paginación
 */
export const getPaginationContainerStyle = (dm) => ({
  backgroundColor: dm ? 'var(--color-dark-background)' : '#F9FAFB',
  borderTopColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)'
});

/**
 * Estilo de fila de tabla
 */
export const getTableRowStyle = (dm) => ({
  borderTopColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)'
});

/**
 * Genera badgeStyle según estado (true=activo, false=inactivo)
 */
export const getStatusBadgeStyle = (isActive, dm) => 
  isActive ? getActiveBadgeStyle(dm) : getInactiveBadgeStyle(dm);
