import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../../../shared/api/banking';

import { useDarkMode, usePaginatedList } from '../../../shared/hooks';
import {
  Pagination,
  TableHeader,
  LoadingSpinner,
  EmptyState
} from '../../../shared/components';
import {
  getSurfaceStyle,
  getPrimaryTextStyle,
  getSecondaryTextStyle,
  getTableRowStyle
} from '../../../shared/utils/styleHelpers';

export const AuditLogs = () => {
  const dm = useDarkMode();
  const {
    items: logs,
    loading,
    pagination,
    loadItems,
    nextPage,
    prevPage,
    resetPage
  } = usePaginatedList(getAuditLogs, 20);

  const [filterEntity, setFilterEntity] = useState('');
  const [filterAction, setFilterAction] = useState('');

  useEffect(() => {
    resetPage();
    loadItems();
  }, [filterEntity, filterAction, loadItems, resetPage]);

  useEffect(() => {
    loadItems();
  }, [pagination.currentPage, loadItems]);

  const getActionColors = (action) => {
    const colors = {
      'CREATE': { bg: dm ? 'rgba(16,185,129,0.18)' : '#DCFCE7', text: dm ? '#10B981' : '#059669' },
      'UPDATE': { bg: dm ? 'rgba(59,130,246,0.18)' : '#DBEAFE', text: dm ? '#3B82F6' : '#0284C7' },
      'DELETE': { bg: dm ? 'rgba(239,68,68,0.18)' : '#FEE2E2', text: dm ? '#EF4444' : '#DC2626' },
      'VIEW': { bg: dm ? 'rgba(107,114,128,0.18)' : '#F3F4F6', text: dm ? '#6B7280' : '#374151' }
    };
    return colors[action] || colors['VIEW'];
  };

  const columns = [
    { key: 'entity', label: 'Entidad' },
    { key: 'action', label: 'Acción' },
    { key: 'user', label: 'Usuario' },
    { key: 'date', label: 'Fecha y Hora' },
    { key: 'details', label: 'Detalles' }
  ];

  return (
    <div className="p-4 md:p-6 transition-colors duration-300" style={getPrimaryTextStyle(dm)}>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={getPrimaryTextStyle(dm)}>Auditoría del Sistema</h1>
        <p className="text-sm mt-1" style={getSecondaryTextStyle(dm)}>Historial de operaciones realizadas en el sistema</p>
      </div>

      {/* FILTROS */}
      <div className="rounded-xl shadow-sm p-4 mb-4 transition-colors duration-300" style={getSurfaceStyle(dm)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            className="w-full px-3 py-2 rounded-lg focus:outline-none"
            style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
          >
            <option value="">Todas las entidades</option>
            <option value="USER">Usuario</option>
            <option value="ACCOUNT">Cuenta</option>
            <option value="CARD">Tarjeta</option>
            <option value="TRANSFER">Transferencia</option>
            <option value="LOAN">Préstamo</option>
          </select>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full px-3 py-2 rounded-lg focus:outline-none"
            style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
          >
            <option value="">Todas las acciones</option>
            <option value="CREATE">Crear</option>
            <option value="UPDATE">Actualizar</option>
            <option value="DELETE">Eliminar</option>
            <option value="VIEW">Ver</option>
          </select>
        </div>
      </div>

      {/* TABLA */}
      <div className="rounded-xl shadow-sm overflow-hidden transition-colors duration-300" style={getSurfaceStyle(dm)}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <TableHeader columns={columns} />
            <tbody>
              {loading ? (
                <LoadingSpinner colSpan={5} message="Cargando auditoría..." />
              ) : logs.length === 0 ? (
                <EmptyState colSpan={5} message="No hay registros de auditoría." />
              ) : (
                logs.map(log => {
                  const colors = getActionColors(log.action);
                  return (
                    <tr key={log._id} className="border-t transition" style={getTableRowStyle(dm)}>
                      <td className="px-4 py-3 font-medium" style={getPrimaryTextStyle(dm)}>{log.entity}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: colors.bg, color: colors.text }}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3" style={getSecondaryTextStyle(dm)}>{log.user?.name || 'Sistema'}</td>
                      <td className="px-4 py-3 text-xs" style={getSecondaryTextStyle(dm)}>
                        {new Date(log.timestamp).toLocaleString('es-ES')}
                      </td>
                      <td className="px-4 py-3 text-xs" style={getSecondaryTextStyle(dm)}>{log.description || '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {!loading && logs.length > 0 && (
          <Pagination
            pagination={pagination}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            itemLabel="registros"
            showTotal={true}
          />
        )}
      </div>
    </div>
  );
};
