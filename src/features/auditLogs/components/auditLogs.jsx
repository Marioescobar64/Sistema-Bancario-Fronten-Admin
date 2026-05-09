import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAuditLogs } from '../../../shared/api/banking';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterEntity, setFilterEntity] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    loadLogs();
  }, [pagination.currentPage, filterEntity, filterAction]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await getAuditLogs(
        pagination.currentPage, 
        20,
        filterEntity || null,
        filterAction || null
      );
      setLogs(response.data);
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        total: response.pagination?.totalRecords || 0
      });
    } catch (error) {
      toast.error('Error al cargar auditoría');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const actionColors = {
    'CREATE': 'bg-green-100 text-green-700',
    'UPDATE': 'bg-blue-100 text-blue-700',
    'DELETE': 'bg-red-100 text-red-700',
    'VIEW': 'bg-gray-100 text-gray-700'
  };

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Auditoría del Sistema</h1>
        <p className="text-gray-500 text-sm mt-1">
          Historial de operaciones realizadas en el sistema
        </p>
      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select
            value={filterEntity}
            onChange={(e) => {
              setFilterEntity(e.target.value);
              setPagination({...pagination, currentPage: 1});
            }}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
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
            onChange={(e) => {
              setFilterAction(e.target.value);
              setPagination({...pagination, currentPage: 1});
            }}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Entidad</th>
                <th className="text-left px-4 py-3 font-semibold">Acción</th>
                <th className="text-left px-4 py-3 font-semibold">Usuario</th>
                <th className="text-left px-4 py-3 font-semibold">Detalles</th>
                <th className="text-left px-4 py-3 font-semibold">Fecha y Hora</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    Cargando auditoría...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No hay registros de auditoría.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {log.entity}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        actionColors[log.action] || 'bg-gray-100 text-gray-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {log.user?.name || 'Sistema'}
                    </td>

                    <td className="px-4 py-3 text-gray-600 text-xs">
                      ID: {log.entityId?.slice(0, 8)}...
                    </td>

                    <td className="px-4 py-3 text-xs text-gray-600">
                      {new Date(log.createdAt).toLocaleString('es-ES')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {!loading && logs.length > 0 && (
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
