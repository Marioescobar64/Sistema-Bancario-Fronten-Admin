import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getLoans, getUsers, createLoan, updateLoan, changeLoanStatus } from '../../../shared/api/banking';
import { CreateLoanModal } from './CreateLoanModal';

export const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadLoans();
    loadUsers();
  }, [pagination.currentPage]);

  const loadLoans = async () => {
    setLoading(true);
    try {
      const response = await getLoans(pagination.currentPage, 10);
      setLoans(response.data);
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

  const filteredLoans = loans.filter(loan => {
    return !searchTerm || loan.loanCode?.includes(searchTerm);
  });

  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user?.name || 'Usuario no encontrado';
  };

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Préstamos</h1>
          <p className="text-gray-500 text-sm mt-1">
            Administra los préstamos otorgados a clientes
          </p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700 transition font-medium"
        >
          + Crear Préstamo
        </button>
      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por código de préstamo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Código</th>
                <th className="text-left px-4 py-3 font-semibold">Cliente</th>
                <th className="text-right px-4 py-3 font-semibold">Monto</th>
                <th className="text-right px-4 py-3 font-semibold">Cuota</th>
                <th className="text-left px-4 py-3 font-semibold">Estado</th>
                <th className="text-left px-4 py-3 font-semibold">Fecha</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    Cargando préstamos...
                  </td>
                </tr>
              ) : filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No hay préstamos registrados.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan._id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {loan.loanCode}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {getUserName(loan.user)}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      Q {loan.amount?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-4 py-3 text-right text-gray-700">
                      Q {loan.monthlyPayment?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        loan.isActive 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {loan.isActive ? 'Activo' : 'Cancelado'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-xs text-gray-600">
                      {new Date(loan.createdAt).toLocaleDateString('es-ES')}
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

      {/* MODAL */}
      <CreateLoanModal 
        isOpen={showCreateModal}
        users={users}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateLoan}
      />
    </div>
  );
};
