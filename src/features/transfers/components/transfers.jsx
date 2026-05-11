import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getTransfers, getAccounts, createTransfer } from '../../../shared/api/banking';
import { CreateTransferModal } from './CreateTransferModal';

export const Transfers = () => {
  const { darkMode = false } = useOutletContext() ?? {};
  const dm = darkMode;
  const [transfers, setTransfers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadTransfers();
    loadAccounts();
  }, [pagination.currentPage]);

  const loadTransfers = async () => {
    setLoading(true);
    try {
      const response = await getTransfers(pagination.currentPage, 10);
      setTransfers(response.data);
      setPagination({
        currentPage: response.page,
        totalPages: response.pages,
        total: response.total
      });
    } catch (error) {
      toast.error('Error al cargar transferencias');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadAccounts = async () => {
    try {
      const response = await getAccounts(1, 100);
      setAccounts(response.data);
    } catch (error) {
      console.error('Error al cargar cuentas:', error);
    }
  };

  const handleCreateTransfer = async (transferData) => {
    try {
      await createTransfer(transferData);
      toast.success('Transferencia realizada exitosamente');
      setShowCreateModal(false);
      await loadTransfers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al realizar transferencia');
    }
  };

  const getAccountNumber = (accountId) => {
    const account = accounts.find(a => a._id === accountId);
    return account?.accountNumber || 'N/A';
  };

  return (
    <div className="p-4 md:p-6 transition-colors duration-300" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>Transferencias</h1>
          <p className="text-sm mt-1" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
            Historial de transferencias entre cuentas
          </p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded text-white transition font-medium"
          style={{ backgroundColor: dm ? 'var(--color-dark-success)' : 'var(--color-success)' }}
        >
          + Nueva Transferencia
        </button>
      </div>

      {/* TABLA */}
      <div className="rounded-xl shadow-sm overflow-hidden transition-colors duration-300" style={{ backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead style={{ backgroundColor: dm ? 'rgba(27,79,114,0.25)' : 'rgba(214,234,248,0.55)' }}>
              <tr>
                <th className="text-left px-4 py-3 font-semibold">De</th>
                <th className="text-left px-4 py-3 font-semibold">Para</th>
                <th className="text-right px-4 py-3 font-semibold">Monto</th>
                <th className="text-left px-4 py-3 font-semibold">Fecha</th>
                <th className="text-left px-4 py-3 font-semibold">Estado</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                    Cargando transferencias...
                  </td>
                </tr>
              ) : transfers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                    No hay transferencias registradas.
                  </td>
                </tr>
              ) : (
                transfers.map((transfer) => (
                  <tr key={transfer._id} className="border-t transition" style={{ borderTopColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
                      {getAccountNumber(transfer.fromAccount?._id || transfer.fromAccount)}
                    </td>

                    <td className="px-4 py-3" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                      {getAccountNumber(transfer.toAccount?._id || transfer.toAccount)}
                    </td>

                    <td className="px-4 py-3 text-right font-medium" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
                      Q {transfer.amount?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-4 py-3 text-xs" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                      {new Date(transfer.createdAt).toLocaleDateString('es-ES')}
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Completada
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {!loading && transfers.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
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

      {/* MODAL */}
      <CreateTransferModal 
        isOpen={showCreateModal}
        accounts={accounts}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTransfer}
        darkMode={dm}
      />
    </div>
  );
};
