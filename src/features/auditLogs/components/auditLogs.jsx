import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAuditLogs } from '../../../shared/api/banking';

export const AuditLogs = () => {
  const { darkMode = false } = useOutletContext() ?? {};
  const dm = darkMode;
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

  const getActionColors = (action) => {
    const baseColors = {
      'CREATE': dm ? 'rgba(16,185,129,0.2) text-emerald-400' : 'bg-green-100 text-green-700',
      'UPDATE': dm ? 'rgba(59,130,246,0.2) text-blue-400' : 'bg-blue-100 text-blue-700',
      'DELETE': dm ? 'rgba(239,68,68,0.2) text-red-400' : 'bg-red-100 text-red-700',
      'VIEW': dm ? 'rgba(107,114,128,0.2) text-gray-400' : 'bg-gray-100 text-gray-700'
    };
    return baseColors[action] || baseColors['VIEW'];
  };

  return (
    <div className="p-4 md:p-6 transition-colors duration-300" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>Auditoría del Sistema</h1>
        <p className="text-sm mt-1" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
          Historial de operaciones realizadas en el sistema
        </p>
      </div>

      {/* FILTROS */}
      <div className="rounded-xl shadow-sm p-4 mb-4 transition-colors duration-300" style={{ backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select
            value={filterEntity}
            onChange={(e) => {
              setFilterEntity(e.target.value);
              setPagination({...pagination, currentPage: 1});
            }}
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
            onChange={(e) => {
              setFilterAction(e.target.value);
              setPagination({...pagination, currentPage: 1});
            }}
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
      <div className="rounded-xl shadow-sm overflow-hidden transition-colors duration-300" style={{ backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead style={{ backgroundColor: dm ? 'rgba(27,79,114,0.25)' : 'rgba(214,234,248,0.55)' }}>
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
                  <td colSpan="5" className="px-4 py-8 text-center" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                    Cargando auditoría...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                    No hay registros de auditoría.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="border-t transition" style={{ borderTopColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
                      {log.entity}
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: dm ? 'rgba(93,173,226,0.18)' : '#E0F2FE', color: dm ? 'var(--color-dark-primary)' : 'var(--color-primary)' }}>
                        {log.action}
                      </span>
                    </td>

                    <td className="px-4 py-3" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                      {log.user?.name || 'Sistema'}
                    </td>

                    <td className="px-4 py-3 text-xs" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                      ID: {log.entityId?.slice(0, 8)}...
                    </td>

                    <td className="px-4 py-3 text-xs" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
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
