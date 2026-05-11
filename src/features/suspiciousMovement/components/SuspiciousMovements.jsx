import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getSuspiciousMovements, updateSuspiciousMovementStatus } from '../../../shared/api/banking';

export const SuspiciousMovements = () => {
  const { darkMode = false } = useOutletContext() ?? {};
  const dm = darkMode;
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    loadMovements();
  }, [pagination.currentPage, filterStatus]);

  const loadMovements = async () => {
    setLoading(true);
    try {
      const response = await getSuspiciousMovements(
        pagination.currentPage, 
        20,
        filterStatus || null
      );
      setMovements(response.data);
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        total: response.pagination?.totalRecords || 0
      });
    } catch (error) {
      toast.error('Error al cargar movimientos sospechosos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (movementId, newStatus) => {
    try {
      await updateSuspiciousMovementStatus(movementId, newStatus);
      toast.success('Estado actualizado');
      await loadMovements();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const statusColors = {
    'PENDING': 'bg-yellow-100 text-yellow-700',
    'REVIEWED': 'bg-blue-100 text-blue-700',
    'APPROVED': 'bg-green-100 text-green-700',
    'REJECTED': 'bg-red-100 text-red-700'
  };

  return (
    <div className="p-4 md:p-6 transition-colors duration-300" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>Movimientos Sospechosos</h1>
        <p className="text-sm mt-1" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
          Transacciones detectadas como potencialmente sospechosas
        </p>
      </div>

      {/* FILTROS */}
      <div className="rounded-xl shadow-sm p-4 mb-4 transition-colors duration-300" style={{ backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPagination({...pagination, currentPage: 1});
          }}
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
      <div className="rounded-xl shadow-sm overflow-hidden transition-colors duration-300" style={{ backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead style={{ backgroundColor: dm ? 'rgba(27,79,114,0.25)' : 'rgba(214,234,248,0.55)' }}>
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Referencia</th>
                <th className="text-left px-4 py-3 font-semibold">Tipo</th>
                <th className="text-right px-4 py-3 font-semibold">Monto</th>
                <th className="text-left px-4 py-3 font-semibold">Razón</th>
                <th className="text-left px-4 py-3 font-semibold">Estado</th>
                <th className="text-right px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                    Cargando movimientos...
                  </td>
                </tr>
              ) : movements.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                    No hay movimientos sospechosos registrados.
                  </td>
                </tr>
              ) : (
                movements.map((movement) => (
                  <tr key={movement._id} className="border-t transition" style={{ borderTopColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
                      {movement.reference?.slice(0, 8)}...
                    </td>

                    <td className="px-4 py-3" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                      {movement.type}
                    </td>

                    <td className="px-4 py-3 text-right font-medium" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
                      Q {movement.amount?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-4 py-3 text-xs" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                      {movement.reason}
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: movement.status === 'PENDING' ? (dm ? 'rgba(245,158,11,0.18)' : '#FEF3C7') : movement.status === 'REVIEWED' ? (dm ? 'rgba(93,173,226,0.18)' : '#DBEAFE') : movement.status === 'APPROVED' ? (dm ? 'rgba(39,174,96,0.18)' : '#DCFCE7') : (dm ? 'rgba(236,112,99,0.18)' : '#FEE2E2'), color: movement.status === 'PENDING' ? (dm ? '#F9E79F' : '#B45309') : movement.status === 'REVIEWED' ? (dm ? 'var(--color-dark-primary)' : 'var(--color-primary)') : movement.status === 'APPROVED' ? (dm ? 'var(--color-dark-success)' : '#15803D') : (dm ? '#F5B7B1' : '#B91C1C') }}>
                        {movement.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      {movement.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(movement._id, 'APPROVED')}
                            className="px-2 py-1 rounded text-xs inline-block"
                            style={{ backgroundColor: dm ? 'rgba(39,174,96,0.18)' : '#DCFCE7', color: dm ? 'var(--color-dark-success)' : '#15803D' }}
                          >
                            Aprobar
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(movement._id, 'REJECTED')}
                            className="px-2 py-1 rounded text-xs inline-block"
                            style={{ backgroundColor: dm ? 'rgba(236,112,99,0.18)' : '#FEE2E2', color: dm ? '#F5B7B1' : '#B91C1C' }}
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
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ backgroundColor: dm ? 'rgba(27,79,114,0.18)' : 'rgba(214,234,248,0.35)', borderTopColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>
            <p className="text-xs" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
              Página {pagination.currentPage} de {pagination.totalPages}
            </p>

            <div className="flex gap-2">
              <button 
                onClick={() => setPagination({...pagination, currentPage: Math.max(1, pagination.currentPage - 1)})}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1.5 rounded text-sm disabled:opacity-50"
                style={{ backgroundColor: dm ? '#0B1C2C' : '#FFFFFF', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
              >
                Anterior
              </button>
              <button 
                onClick={() => setPagination({...pagination, currentPage: Math.min(pagination.totalPages, pagination.currentPage + 1)})}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1.5 rounded text-sm disabled:opacity-50"
                style={{ backgroundColor: dm ? '#0B1C2C' : '#FFFFFF', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
