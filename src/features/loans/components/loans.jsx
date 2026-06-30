import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  getLoans,
  getUsers,
  getAccounts,
  createLoan,
  changeLoanStatus
} from '../../../shared/api/admin';

import { useDarkMode, usePaginatedList } from '../../../shared/hooks';
import {
  Pagination,
  SearchFilter,
  TableHeader,
  ActionButton,
  StatusBadge,
  LoadingSpinner,
  EmptyState
} from '../../../shared/components';
import {
  getSurfaceStyle,
  getPrimaryTextStyle,
  getSecondaryTextStyle,
  getTableRowStyle
} from '../../../shared/utils/styleHelpers';

import { CreateLoanModal } from './CreateLoanModal';

export const Loans = () => {
  const dm = useDarkMode();
  const {
    items: loans,
    loading,
    pagination,
    loadItems,
    nextPage,
    prevPage,
    resetPage
  } = usePaginatedList(getLoans, 10);

  const [users, setUsers] = useState([]);
  const [accountsList, setAccountsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusDrafts, setStatusDrafts] = useState({});

  const loadData = async () => {
    try {
      const [usersRes, accountsRes] = await Promise.all([
        getUsers(1, 100),
        getAccounts(1, 100)
      ]);
      setUsers(usersRes?.data || []);
      setAccountsList(accountsRes?.data || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setUsers([]);
      setAccountsList([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Initialize statusDrafts with current statuses
    const drafts = {};
    loans.forEach(loan => {
      if (!drafts[loan._id]) {
        drafts[loan._id] = loan.status;
      }
    });
    setStatusDrafts(drafts);
  }, [loans]);

  useEffect(() => {
    loadItems();
  }, [pagination.currentPage, loadItems]);

  const handleCreateLoan = async (loanData) => {
    try {
      await createLoan(loanData);
      toast.success('Préstamo creado exitosamente');
      setShowCreateModal(false);
      resetPage();
      await loadItems();
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
      await loadItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al cambiar estado del préstamo');
    }
  };

  const filteredLoans = loans.filter(loan => {
    return !searchTerm || loan.loanNumber?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getUserName = (loanUser) => {
    // Si el user viene populado del backend como objeto
    if (loanUser && typeof loanUser === 'object' && loanUser.name) {
      return loanUser.name;
    }
    // Fallback: buscar en la lista de usuarios
    const userId = typeof loanUser === 'object' ? loanUser._id : loanUser;
    const user = users.find(u => u._id === userId);
    return user?.name || 'Usuario no encontrado';
  };

  const columns = [
    { key: 'code', label: 'Código' },
    { key: 'client', label: 'Cliente' },
    { key: 'amount', label: 'Monto', className: 'text-right' },
    { key: 'payment', label: 'Cuota', className: 'text-right' },
    { key: 'status', label: 'Estado' },
    { key: 'date', label: 'Fecha' },
    { key: 'actions', label: 'Acciones' }
  ];

  return (
    <div className="p-4 md:p-6 transition-colors duration-300" style={getPrimaryTextStyle(dm)}>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={getPrimaryTextStyle(dm)}>Gestión de Préstamos</h1>
          <p className="text-sm mt-1" style={getSecondaryTextStyle(dm)}>Administra los préstamos otorgados a clientes</p>
        </div>
        <ActionButton label="+ Crear Préstamo" onClick={() => setShowCreateModal(true)} variant="success" />
      </div>

      {/* FILTROS */}
      <SearchFilter value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por código de préstamo..." />

      {/* TABLA */}
      <div 
        className="rounded-xl overflow-hidden transition-all duration-300 mb-6"
        style={{
          ...getSurfaceStyle(dm),
          border: `1px solid ${dm ? 'rgba(93,173,226,0.15)' : 'rgba(31,78,121,0.1)'}`,
          boxShadow: dm 
            ? '0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(93,173,226,0.1)'
            : '0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(59,130,246,0.1)'
        }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <TableHeader columns={columns} />
            <tbody>
              {loading ? (
                <LoadingSpinner colSpan={7} message="Cargando préstamos..." />
              ) : filteredLoans.length === 0 ? (
                <EmptyState colSpan={7} message="No hay préstamos registrados." />
              ) : (
                filteredLoans.map((loan, index) => (
                  <tr 
                    key={loan._id} 
                    className="transition-all duration-200 hover:shadow-md"
                    style={{
                      backgroundColor: index % 2 === 0 
                        ? dm ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.5)'
                        : dm ? 'rgba(31,78,121,0.05)' : 'rgba(59,130,246,0.02)',
                      borderBottom: `1px solid ${dm ? 'rgba(93,173,226,0.1)' : 'rgba(31,78,121,0.08)'}`,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = dm ? 'rgba(93,173,226,0.1)' : 'rgba(59,130,246,0.06)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 
                      ? dm ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.5)'
                      : dm ? 'rgba(31,78,121,0.05)' : 'rgba(59,130,246,0.02)'}
                  >
                    <td className="px-6 py-4 md:px-4 md:py-3 font-medium" style={getPrimaryTextStyle(dm)}>{loan.loanNumber}</td>
                    <td className="px-6 py-4 md:px-4 md:py-3" style={getSecondaryTextStyle(dm)}>{getUserName(loan.user)}</td>
                    <td className="px-6 py-4 md:px-4 md:py-3 text-right font-medium" style={getPrimaryTextStyle(dm)}>
                      {loan.currency === 'USD' ? '$' : 'Q'} {loan.amount?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 md:px-4 md:py-3 text-right" style={getSecondaryTextStyle(dm)}>
                      {loan.currency === 'USD' ? '$' : 'Q'} {loan.monthlyPayment?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 md:px-4 md:py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                        backgroundColor: ['AL_DIA', 'APROBADO', 'DESEMBOLSADO', 'PAGADO'].includes(loan.status)
                          ? (dm ? 'rgba(34,197,94,0.18)' : '#DCFCE7')
                          : ['RECHAZADO', 'CANCELADO', 'EN_MORA'].includes(loan.status)
                          ? (dm ? 'rgba(239,68,68,0.18)' : '#FEE2E2')
                          : (dm ? 'rgba(245,158,11,0.18)' : '#FEF3C7'),
                        color: ['AL_DIA', 'APROBADO', 'DESEMBOLSADO', 'PAGADO'].includes(loan.status)
                          ? (dm ? 'var(--color-dark-success)' : '#15803D')
                          : ['RECHAZADO', 'CANCELADO', 'EN_MORA'].includes(loan.status)
                          ? (dm ? '#F87171' : '#DC2626')
                          : (dm ? '#FBBF24' : '#B45309')
                      }}>
                        {loan.status === 'SOLICITADO' ? 'Solicitado'
                          : loan.status === 'EN_REVISION' ? 'En Revisión'
                          : loan.status === 'APROBADO' ? 'Aprobado'
                          : loan.status === 'DESEMBOLSADO' ? 'Desembolsado'
                          : loan.status === 'AL_DIA' ? 'Al Día'
                          : loan.status === 'EN_MORA' ? 'En Mora'
                          : loan.status === 'PAGADO' ? 'Pagado'
                          : loan.status === 'RECHAZADO' ? 'Rechazado'
                          : loan.status === 'CANCELADO' ? 'Cancelado'
                          : loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 md:px-4 md:py-3 text-xs" style={getSecondaryTextStyle(dm)}>
                      {new Date(loan.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 md:px-4 md:py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={statusDrafts[loan._id] || loan.status}
                          onChange={(e) => setStatusDrafts((current) => ({...current, [loan._id]: e.target.value}))}
                          className="px-2 py-1 rounded-lg text-xs focus:outline-none"
                          style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
                        >
                          <option value="SOLICITADO">Solicitado</option>
                          <option value="EN_REVISION">En Revisión</option>
                          <option value="APROBADO">Aprobado</option>
                          <option value="DESEMBOLSADO">Desembolsado</option>
                          <option value="AL_DIA">Al Día</option>
                          <option value="EN_MORA">En Mora</option>
                          <option value="PAGADO">Pagado</option>
                          <option value="RECHAZADO">Rechazado</option>
                          <option value="CANCELADO">Cancelado</option>
                        </select>
                        <ActionButton
                          label="Guardar"
                          onClick={() => handleChangeLoanStatus(loan._id)}
                          variant="primary"
                        />
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
          <Pagination
            pagination={pagination}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            itemLabel="préstamos"
            showTotal={true}
          />
        )}
      </div>

      {/* MODAL */}
      <CreateLoanModal 
        isOpen={showCreateModal}
        users={users}
        accounts={accountsList}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateLoan}
        darkMode={dm}
      />
    </div>
  );
};
