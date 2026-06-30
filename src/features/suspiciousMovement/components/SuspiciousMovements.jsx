import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getSuspiciousMovements, updateSuspiciousMovementStatus } from '../../../shared/api/admin';

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
    'NUEVA': { bg: dm ? 'rgba(245,158,11,0.18)' : '#FEF3C7', text: dm ? '#FBBF24' : '#B45309' },
    'EN_INVESTIGACION': { bg: dm ? 'rgba(59,130,246,0.18)' : '#DBEAFE', text: dm ? '#3B82F6' : '#0284C7' },
    'ESCALADA_IVE': { bg: dm ? 'rgba(168,85,247,0.18)' : '#F3E8FF', text: dm ? '#A855F7' : '#7C3AED' },
    'RESUELTA_SIN_ACCION': { bg: dm ? 'rgba(34,197,94,0.18)' : '#DCFCE7', text: dm ? '#22C55E' : '#15803D' },
    'RESUELTA_CON_REPORTE': { bg: dm ? 'rgba(34,197,94,0.18)' : '#DCFCE7', text: dm ? '#22C55E' : '#15803D' },
    'ARCHIVADA': { bg: dm ? 'rgba(107,114,128,0.18)' : '#F3F4F6', text: dm ? '#9CA3AF' : '#6B7280' }
  };

  const statusLabels = {
    'NUEVA': 'Nueva',
    'EN_INVESTIGACION': 'En Investigación',
    'ESCALADA_IVE': 'Escalada IVE',
    'RESUELTA_SIN_ACCION': 'Resuelta (Sin acción)',
    'RESUELTA_CON_REPORTE': 'Resuelta (Con reporte)',
    'ARCHIVADA': 'Archivada'
  };

  const alertTypeLabels = {
    'TRANSACCION_INUSUAL': 'Transacción Inusual',
    'FRACCIONAMIENTO': 'Fraccionamiento',
    'PEP_ACTIVIDAD': 'Actividad PEP',
    'PAIS_ALTO_RIESGO': 'País Alto Riesgo',
    'MULTIPLE_CUENTAS': 'Múltiples Cuentas',
    'CAMBIO_PERFIL_TRANSACCIONAL': 'Cambio Perfil',
    'TRANSFERENCIA_SOSPECHOSA': 'Transferencia Sospechosa',
    'DOCUMENTO_FALSO': 'Documento Falso',
    'LAVADO_DINERO': 'Lavado de Dinero',
    'FINANCIAMIENTO_TERRORISMO': 'Financiamiento Terrorismo'
  };

  const riskColors = {
    'BAJO': { bg: dm ? 'rgba(34,197,94,0.18)' : '#DCFCE7', text: dm ? '#22C55E' : '#15803D' },
    'MEDIO': { bg: dm ? 'rgba(245,158,11,0.18)' : '#FEF3C7', text: dm ? '#FBBF24' : '#B45309' },
    'ALTO': { bg: dm ? 'rgba(249,115,22,0.18)' : '#FFEDD5', text: dm ? '#F97316' : '#C2410C' },
    'CRITICO': { bg: dm ? 'rgba(239,68,68,0.18)' : '#FEE2E2', text: dm ? '#EF4444' : '#DC2626' }
  };

  const columns = [
    { key: 'case', label: 'Caso' },
    { key: 'date', label: 'Fecha' },
    { key: 'amount', label: 'Monto', className: 'text-right' },
    { key: 'alertType', label: 'Tipo Alerta' },
    { key: 'risk', label: 'Riesgo' },
    { key: 'status', label: 'Estado' },
    { key: 'actions', label: 'Acciones', className: 'text-right' }
  ];

  return (
    <div className="p-4 md:p-6 transition-colors duration-300" style={getPrimaryTextStyle(dm)}>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={getPrimaryTextStyle(dm)}>Movimientos Sospechosos</h1>
        <p className="text-sm mt-1" style={getSecondaryTextStyle(dm)}>Casos de transacciones detectadas como potencialmente sospechosas</p>
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
          <option value="NUEVA">Nueva</option>
          <option value="EN_INVESTIGACION">En Investigación</option>
          <option value="ESCALADA_IVE">Escalada IVE</option>
          <option value="RESUELTA_SIN_ACCION">Resuelta (Sin acción)</option>
          <option value="RESUELTA_CON_REPORTE">Resuelta (Con reporte)</option>
          <option value="ARCHIVADA">Archivada</option>
        </select>
      </div>

      {/* TABLA */}
      <div className="rounded-xl shadow-sm overflow-hidden transition-colors duration-300" style={getSurfaceStyle(dm)}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <TableHeader columns={columns} />
            <tbody>
              {loading ? (
                <LoadingSpinner colSpan={7} message="Cargando movimientos..." />
              ) : movements.length === 0 ? (
                <EmptyState colSpan={7} message="No hay movimientos sospechosos registrados." />
              ) : (
                movements.map(movement => (
                  <tr key={movement._id} className="border-t transition" style={getTableRowStyle(dm)}>
                    <td className="px-4 py-3 font-medium text-xs" style={getPrimaryTextStyle(dm)}>
                      {movement.caseNumber}
                    </td>
                    <td className="px-4 py-3 text-xs" style={getSecondaryTextStyle(dm)}>
                      {new Date(movement.createdAt).toLocaleString('es-ES')}
                    </td>
                    <td className="px-4 py-3 text-right font-medium" style={getPrimaryTextStyle(dm)}>
                      {movement.currency === 'USD' ? '$' : 'Q'} {movement.amount?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-xs" style={getSecondaryTextStyle(dm)}>
                      {alertTypeLabels[movement.alertType] || movement.alertType}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{
                        backgroundColor: riskColors[movement.riskLevel]?.bg || '#F3F4F6',
                        color: riskColors[movement.riskLevel]?.text || '#6B7280'
                      }}>
                        {movement.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                        backgroundColor: statusColors[movement.status]?.bg || '#F3F4F6',
                        color: statusColors[movement.status]?.text || '#6B7280'
                      }}>
                        {statusLabels[movement.status] || movement.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {movement.status === 'NUEVA' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(movement._id, 'EN_INVESTIGACION')}
                            className="px-2 py-1 rounded text-xs"
                            style={{ backgroundColor: statusColors['EN_INVESTIGACION'].bg, color: statusColors['EN_INVESTIGACION'].text }}
                          >
                            Investigar
                          </button>
                        </>
                      )}
                      {movement.status === 'EN_INVESTIGACION' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(movement._id, 'ESCALADA_IVE')}
                            className="px-2 py-1 rounded text-xs"
                            style={{ backgroundColor: statusColors['ESCALADA_IVE'].bg, color: statusColors['ESCALADA_IVE'].text }}
                          >
                            Escalar IVE
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(movement._id, 'RESUELTA_SIN_ACCION')}
                            className="px-2 py-1 rounded text-xs"
                            style={{ backgroundColor: statusColors['RESUELTA_SIN_ACCION'].bg, color: statusColors['RESUELTA_SIN_ACCION'].text }}
                          >
                            Resolver
                          </button>
                        </>
                      )}
                      {movement.status === 'ESCALADA_IVE' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(movement._id, 'RESUELTA_CON_REPORTE')}
                            className="px-2 py-1 rounded text-xs"
                            style={{ backgroundColor: statusColors['RESUELTA_CON_REPORTE'].bg, color: statusColors['RESUELTA_CON_REPORTE'].text }}
                          >
                            Resolver con Reporte
                          </button>
                        </>
                      )}
                      {['RESUELTA_SIN_ACCION', 'RESUELTA_CON_REPORTE'].includes(movement.status) && (
                        <button 
                          onClick={() => handleUpdateStatus(movement._id, 'ARCHIVADA')}
                          className="px-2 py-1 rounded text-xs"
                          style={{ backgroundColor: statusColors['ARCHIVADA'].bg, color: statusColors['ARCHIVADA'].text }}
                        >
                          Archivar
                        </button>
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
