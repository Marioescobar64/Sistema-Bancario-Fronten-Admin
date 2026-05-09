import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getSuspiciousMovements, updateSuspiciousMovementStatus } from '../../../shared/api/banking';

export const SuspiciousMovements = () => {
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
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Movimientos Sospechosos</h1>
        <p className="text-gray-500 text-sm mt-1">
          Transacciones detectadas como potencialmente sospechosas
        </p>
      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPagination({...pagination, currentPage: 1});
          }}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="PENDING">Pendiente</option>
          <option value="REVIEWED">Revisado</option>
          <option value="APPROVED">Aprobado</option>
          <option value="REJECTED">Rechazado</option>
        </select>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
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
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    Cargando movimientos...
                  </td>
                </tr>
              ) : movements.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No hay movimientos sospechosos registrados.
                  </td>
                </tr>
              ) : (
                movements.map((movement) => (
                  <tr key={movement._id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {movement.reference?.slice(0, 8)}...
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {movement.type}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      Q {movement.amount?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {movement.reason}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[movement.status] || 'bg-gray-100 text-gray-700'
                      }`}>
                        {movement.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      {movement.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(movement._id, 'APPROVED')}
                            className="px-2 py-1 rounded text-xs bg-green-100 text-green-700 hover:bg-green-200 inline-block"
                          >
                            Aprobar
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(movement._id, 'REJECTED')}
                            className="px-2 py-1 rounded text-xs bg-red-100 text-red-700 hover:bg-red-200 inline-block"
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
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <p className="text-xs text-gray-600">
              Página {pagination.currentPage} de {pagination.totalPages}
            </p>

            <div className="flex gap-2">
              <button 
                onClick={() => setPagination({...pagination, currentPage: Math.max(1, pagination.currentPage - 1)})}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1.5 rounded border bg-white text-sm disabled:opacity-50"
              >
                Anterior
              </button>
              <button 
                onClick={() => setPagination({...pagination, currentPage: Math.min(pagination.totalPages, pagination.currentPage + 1)})}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1.5 rounded border bg-white text-sm disabled:opacity-50"
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
