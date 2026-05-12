import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  getAccounts,
  getUsers,
  createAccount,
  updateAccount,
  changeAccountStatus
} from '../../../shared/api/banking';

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

import { CreateAccountModal } from './CreateAccountModal';
import { AccountDetailModal } from './AccountDetailModal';

export const Accounts = () => {
  const dm = useDarkMode();
  const {
    items: accounts,
    loading,
    pagination,
    loadItems,
    nextPage,
    prevPage,
    resetPage
  } = usePaginatedList(getAccounts, 10);

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const loadUsers = async () => {
    try {
      const response = await getUsers(1, 100);
      setUsers(response?.data || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    loadItems();
  }, [pagination.currentPage, loadItems]);

  const handleCreateAccount = async (accountData) => {
    try {
      await createAccount(accountData);
      toast.success('Cuenta creada exitosamente');
      setShowCreateModal(false);
      resetPage();
      await loadItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear cuenta');
    }
  };

  const handleUpdateAccount = async (accountId, accountData) => {
    try {
      await updateAccount(accountId, accountData);
      toast.success('Cuenta actualizada exitosamente');
      setShowDetailModal(false);
      await loadItems();
    } catch {
      toast.error('Error al actualizar cuenta');
    }
  };

  const handleChangeStatus = async (accountId, isActive) => {
    try {
      await changeAccountStatus(accountId);
      toast.success(isActive ? 'Cuenta activada' : 'Cuenta desactivada');
      await loadItems();
    } catch {
      toast.error('Error al cambiar estado de la cuenta');
    }
  };

  const filteredAccounts = (accounts || []).filter(account => {
    return !searchTerm ||
      account.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const columns = [
    { key: 'number', label: 'Número de Cuenta' },
    { key: 'type', label: 'Tipo' },
    { key: 'owner', label: 'Titular' },
    { key: 'balance', label: 'Saldo', className: 'text-right' },
    { key: 'status', label: 'Estado' },
    { key: 'actions', label: 'Acciones', className: 'text-right' }
  ];

  return (
    <div className="p-4 md:p-6 transition-colors duration-300" style={getPrimaryTextStyle(dm)}>
      {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={getPrimaryTextStyle(dm)}>Gestión de Cuentas</h1>
          <p className="text-sm mt-1" style={getSecondaryTextStyle(dm)}>Administra las cuentas bancarias del sistema</p>
        </div>
        <ActionButton label="+ Crear Cuenta" onClick={() => setShowCreateModal(true)} variant="success" />
      </div>

      {/* BÚSQUEDA */}
      <SearchFilter value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por número de cuenta o tipo..." />

      {/* TABLA */}
      <div className="rounded-xl shadow-sm overflow-hidden transition-colors duration-300 mb-6" style={getSurfaceStyle(dm)}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <TableHeader columns={columns} />
            <tbody>
              {loading ? (
                <LoadingSpinner colSpan={6} message="Cargando cuentas..." />
              ) : filteredAccounts.length === 0 ? (
                <EmptyState colSpan={6} message="No hay cuentas para mostrar." />
              ) : (
                filteredAccounts.map(account => (
                  <tr key={account._id} className="border-t transition" style={getTableRowStyle(dm)}>
                    <td className="px-6 py-4 md:px-4 md:py-3 font-medium" style={getPrimaryTextStyle(dm)}>{account.accountNumber}</td>
                    <td className="px-6 py-4 md:px-4 md:py-3" style={getSecondaryTextStyle(dm)}>{account.type}</td>
                    <td className="px-6 py-4 md:px-4 md:py-3" style={getSecondaryTextStyle(dm)}>{account.user?.name || 'Usuario no encontrado'}</td>
                    <td className="px-6 py-4 md:px-4 md:py-3 text-right font-medium" style={getPrimaryTextStyle(dm)}>
                      Q {account.balance?.toLocaleString('es-ES', { minimumFractionDigits: 2 }) || '0.00'}
                    </td>
                    <td className="px-6 py-4 md:px-4 md:py-3">
                      <StatusBadge isActive={account?.isActive} activeLabel="Activa" inactiveLabel="Inactiva" />
                    </td>
                    <td className="px-6 py-4 md:px-4 md:py-3 text-right space-x-2">
                      <ActionButton
                        label="Ver"
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowDetailModal(true);
                        }}
                        variant="blue"
                      />
                      <ActionButton
                        label={account?.isActive ? 'Desactivar' : 'Activar'}
                        onClick={() => handleChangeStatus(account._id, !account.isActive)}
                        variant={account?.isActive ? 'danger' : 'success'}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {!loading && filteredAccounts.length > 0 && (
          <Pagination
            pagination={pagination}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            itemLabel="cuentas"
            showTotal={true}
          />
        )}
      </div>

      {/* MODALES */}
      <CreateAccountModal
        isOpen={showCreateModal}
        users={users}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateAccount}
        darkMode={dm}
      />
      {selectedAccount && (
        <AccountDetailModal
          isOpen={showDetailModal}
          account={selectedAccount}
          users={users}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedAccount(null);
          }}
          onUpdate={handleUpdateAccount}
          darkMode={dm}
        />
      )}
    </div>
  );
};