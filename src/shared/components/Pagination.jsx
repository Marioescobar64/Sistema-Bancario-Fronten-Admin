import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { getPaginationContainerStyle, getSecondaryButtonStyle, getSecondaryTextStyle } from '../utils/styleHelpers';

/**
 * Componente Pagination reutilizable
 * @param {Object} pagination - {currentPage, totalPages, total}
 * @param {Function} onPrevPage - Callback para página anterior
 * @param {Function} onNextPage - Callback para página siguiente
 * @param {string} itemLabel - Etiqueta para los items (ej: "usuarios", "cuentas")
 */
export const Pagination = ({ 
  pagination, 
  onPrevPage, 
  onNextPage, 
  itemLabel = 'items',
  showTotal = true 
}) => {
  const dm = useDarkMode();
  const { currentPage, totalPages, total } = pagination;
  
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div 
      className="flex items-center justify-between px-4 py-3 border-t"
      style={getPaginationContainerStyle(dm)}
    >
      <p className="text-xs" style={getSecondaryTextStyle(dm)}>
        Página {currentPage} de {totalPages}
        {showTotal && ` (${total} ${itemLabel})`}
      </p>

      <div className="flex gap-2">
        <button
          onClick={onPrevPage}
          disabled={isFirstPage}
          className="px-3 py-1.5 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          style={getSecondaryButtonStyle(dm)}
        >
          Anterior
        </button>

        <span 
          className="px-2 py-1.5 text-sm"
          style={getSecondaryTextStyle(dm)}
        >
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={onNextPage}
          disabled={isLastPage}
          className="px-3 py-1.5 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          style={getSecondaryButtonStyle(dm)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
