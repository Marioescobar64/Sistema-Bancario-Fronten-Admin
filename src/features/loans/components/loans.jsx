import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getLoans, getUsers, createLoan, changeLoanStatus } from '../../../shared/api/banking';
import { CreateLoanModal } from './CreateLoanModal';

export const Loans = () => {
  const { darkMode = false } = useOutletContext() ?? {};
  const dm = darkMode;
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusDrafts, setStatusDrafts] = useState({});

  useEffect(() => {
    loadLoans();
    loadUsers();
  }, [pagination.currentPage]);

  const loadLoans = async () => {
    setLoading(true);
    try {
      const response = await getLoans(pagination.currentPage, 10);
      setLoans(response.data);
      setStatusDrafts((current) => {
        const next = { ...current };
        response.data.forEach((loan) => {
          if (!next[loan._id]) {
            next[loan._id] = loan.status;
          }
        });
        return next;
      });
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalRecords
      });
    } catch (error) {
      toast.error('Error al cargar préstamos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await getUsers(1, 100);
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const handleCreateLoan = async (loanData) => {
    try {
      await createLoan(loanData);
      toast.success('Préstamo creado exitosamente');
      setShowCreateModal(false);
      await loadLoans();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear préstamo');
    }
  };

  const handleChangeLoanStatus = async (loanId) => {
    const nextStatus = statusDrafts[loanId];

    if (!nextStatus) {
      toast.error('Selecciona un estado');
      return;
    }

    try {
      await changeLoanStatus(loanId, nextStatus);
      toast.success('Estado del préstamo actualizado');
      await loadLoans();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al cambiar estado del préstamo');
    }
  };

  const filteredLoans = loans.filter(loan => {
    return !searchTerm || loan.loanCode?.includes(searchTerm);
  });

  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user?.name || 'Usuario no encontrado';
  };

  return (
    <div className="p-4 md:p-6 transition-colors duration-300" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>Gestión de Préstamos</h1>
          <p className="text-sm mt-1" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
            Administra los préstamos otorgados a clientes
          </p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded text-white transition font-medium"
          style={{ backgroundColor: dm ? 'var(--color-dark-success)' : 'var(--color-success)' }}
        >
          + Crear Préstamo
        </button>
      </div>

      {/* FILTROS */}
      <div className="rounded-xl shadow-sm p-4 mb-4 transition-colors duration-300" style={{ backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}>
        <input
          type="text"
          placeholder="Buscar por código de préstamo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded-lg focus:outline-none"
          style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
        />
      </div>

      {/* TABLA */}
      <div className="rounded-xl shadow-sm overflow-hidden transition-colors duration-300" style={{ backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead style={{ backgroundColor: dm ? 'rgba(27,79,114,0.25)' : 'rgba(214,234,248,0.55)' }}>
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Código</th>
                <th className="text-left px-4 py-3 font-semibold">Cliente</th>
                <th className="text-right px-4 py-3 font-semibold">Monto</th>
                <th className="text-right px-4 py-3 font-semibold">Cuota</th>
                <th className="text-left px-4 py-3 font-semibold">Estado</th>
                <th className="text-left px-4 py-3 font-semibold">Fecha</th>
                <th className="text-left px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                    Cargando préstamos...
                  </td>
                </tr>
              ) : filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                    No hay préstamos registrados.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan._id} className="border-t transition" style={{ borderTopColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
                      {loan.loanCode}
                    </td>

                    <td className="px-4 py-3" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                      {getUserName(loan.user)}
                    </td>

                    <td className="px-4 py-3 text-right font-medium" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
                      Q {loan.amount?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-4 py-3 text-right" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                      Q {loan.monthlyPayment?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: loan.isActive ? (dm ? 'rgba(93,173,226,0.18)' : '#DBEAFE') : (dm ? 'rgba(169,204,227,0.14)' : '#E5E7EB'), color: loan.isActive ? (dm ? 'var(--color-dark-primary)' : 'var(--color-primary)') : (dm ? 'var(--color-dark-text-secondary)' : '#4B5563') }}>
                        {loan.isActive ? 'Activo' : 'Cancelado'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-xs" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                      {new Date(loan.createdAt).toLocaleDateString('es-ES')}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={statusDrafts[loan._id] || loan.status}
                          onChange={(e) => setStatusDrafts((current) => ({
                            ...current,
                            [loan._id]: e.target.value
                          }))}
                          className="px-2 py-1 rounded-lg text-xs focus:outline-none"
                          style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="REJECTED">REJECTED</option>
                          <option value="PAID">PAID</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleChangeLoanStatus(loan._id)}
                          className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold"
                          style={{ backgroundColor: dm ? 'var(--color-dark-primary)' : 'var(--color-primary)' }}
                        >
                          Guardar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {!loading && filteredLoans.length > 0 && (
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
      <CreateLoanModal 
        isOpen={showCreateModal}
        users={users}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateLoan}
        darkMode={dm}
      />
    </div>
  );
};
