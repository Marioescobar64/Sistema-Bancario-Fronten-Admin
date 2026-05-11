import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getSuspiciousMovements, updateSuspiciousMovementStatus } from '../../../shared/api/banking';

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

export const SuspiciousMovements = () => {
  const dm = useDarkMode();
  const {
    items: movements,
    loading,
    pagination,
    loadItems,
    nextPage,
    prevPage,
    resetPage
  } = usePaginatedList(getSuspiciousMovements, 20);

  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    resetPage();
    loadItems();
  }, [filterStatus, loadItems, resetPage]);

  useEffect(() => {
    loadItems();
  }, [pagination.currentPage, loadItems]);

  const handleUpdateStatus = async (movementId, newStatus) => {
    try {
      await updateSuspiciousMovementStatus(movementId, newStatus);
      toast.success('Estado actualizado');
      await loadItems();
    } catch {
      toast.error('Error al actualizar estado');
    }
  };

  const statusColors = {
    'PENDING': { bg: dm ? 'rgba(217,119,6,0.18)' : '#FEF3C7', text: dm ? '#D97706' : '#92400E' },
    'REVIEWED': { bg: dm ? 'rgba(59,130,246,0.18)' : '#DBEAFE', text: dm ? '#3B82F6' : '#0284C7' },
    'APPROVED': { bg: dm ? 'rgba(34,197,94,0.18)' : '#DCFCE7', text: dm ? '#22C55E' : '#15803D' },
    'REJECTED': { bg: dm ? 'rgba(239,68,68,0.18)' : '#FEE2E2', text: dm ? '#EF4444' : '#DC2626' }
  };

  const columns = [
    { key: 'date', label: 'Fecha' },
    { key: 'amount', label: 'Monto', className: 'text-right' },
    { key: 'type', label: 'Tipo' },
    { key: 'reason', label: 'Razón' },
    { key: 'status', label: 'Estado' },
    { key: 'actions', label: 'Acciones', className: 'text-right' }
  ];

  return (
    <div className="p-4 md:p-6 transition-colors duration-300" style={getPrimaryTextStyle(dm)}>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={getPrimaryTextStyle(dm)}>Movimientos Sospechosos</h1>
        <p className="text-sm mt-1" style={getSecondaryTextStyle(dm)}>Transacciones detectadas como potencialmente sospechosas</p>
      </div>

      {/* FILTROS */}
      <div className="rounded-xl shadow-sm p-4 mb-4 transition-colors duration-300" style={getSurfaceStyle(dm)}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full px-3 py-2 rounded-lg focus:outline-none"
          style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
        >
          <option value="">Todos los estados</option>
          <option value="PENDING">Pendiente</option>
          <option value="REVIEWED">Revisado</option>
          <option value="APPROVED">Aprobado</option>
          <option value="REJECTED">Rechazado</option>
        </select>
      </div>

      {/* TABLA */}
      <div className="rounded-xl shadow-sm overflow-hidden transition-colors duration-300" style={getSurfaceStyle(dm)}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <TableHeader columns={columns} />
            <tbody>
              {loading ? (
                <LoadingSpinner colSpan={6} message="Cargando movimientos..." />
              ) : movements.length === 0 ? (
                <EmptyState colSpan={6} message="No hay movimientos sospechosos registrados." />
              ) : (
                movements.map(movement => (
                  <tr key={movement._id} className="border-t transition" style={getTableRowStyle(dm)}>
                    <td className="px-4 py-3 font-medium" style={getPrimaryTextStyle(dm)}>
                      {new Date(movement.date).toLocaleString('es-ES')}
                    </td>
                    <td className="px-4 py-3 text-right font-medium" style={getPrimaryTextStyle(dm)}>
                      Q {movement.amount?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3" style={getSecondaryTextStyle(dm)}>
                      {movement.type}
                    </td>
                    <td className="px-4 py-3 text-xs" style={getSecondaryTextStyle(dm)}>
                      {movement.reason}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: statusColors[movement.status]?.bg, color: statusColors[movement.status]?.text }}>
                        {movement.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {movement.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(movement._id, 'APPROVED')}
                            className="px-2 py-1 rounded text-xs"
                            style={{ backgroundColor: statusColors['APPROVED'].bg, color: statusColors['APPROVED'].text }}
                          >
                            Aprobar
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(movement._id, 'REJECTED')}
                            className="px-2 py-1 rounded text-xs"
                            style={{ backgroundColor: statusColors['REJECTED'].bg, color: statusColors['REJECTED'].text }}
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {!loading && movements.length > 0 && (
          <Pagination
            pagination={pagination}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            itemLabel="movimientos"
            showTotal={true}
          />
        )}
      </div>
    </div>
  );
};
