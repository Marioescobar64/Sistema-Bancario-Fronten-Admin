import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getAccounts,
  getUsers,
  createAccount,
  updateAccount,
  changeAccountStatus
} from '../../../shared/api/banking';

import { CreateAccountModal } from './CreateAccountModal';
import { AccountDetailModal } from './AccountDetailModal';

export const Accounts = () => {
  const { darkMode = false } = useOutletContext() ?? {};
  const dm = darkMode;

  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    loadAccounts();
    loadUsers();
  }, [pagination.currentPage]);

  const loadAccounts = async () => {

    setLoading(true);

    try {

      const response = await getAccounts(
        pagination.currentPage,
        10
      );

      console.log('ACCOUNTS RESPONSE:', response);

      setAccounts(response?.data || []);

      setPagination({
        currentPage: response?.pagination?.currentPage || 1,
        totalPages: response?.pagination?.totalPages || 1,
        total: response?.pagination?.totalRecords || 0
      });

    } catch (error) {

      toast.error('Error al cargar cuentas');
      console.error(error);

      setAccounts([]);

    } finally {

      setLoading(false);

    }
  };

  const loadUsers = async () => {

    try {

      const response = await getUsers(1, 100);

      setUsers(response?.data || []);

    } catch (error) {

      console.error('Error al cargar usuarios:', error);

      setUsers([]);

    }
  };

  const handleCreateAccount = async (accountData) => {

    try {

      await createAccount(accountData);

      toast.success('Cuenta creada exitosamente');

      setShowCreateModal(false);

      await loadAccounts();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        'Error al crear cuenta'
      );
    }
  };

  const handleUpdateAccount = async (accountId, accountData) => {

    try {

      await updateAccount(accountId, accountData);

      toast.success('Cuenta actualizada exitosamente');

      setShowDetailModal(false);

      await loadAccounts();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        'Error al actualizar cuenta'
      );
    }
  };

  const handleChangeStatus = async (accountId, isActive) => {

    try {

      await changeAccountStatus(accountId, isActive);

      toast.success(
        isActive
          ? 'Cuenta activada'
          : 'Cuenta desactivada'
      );

      await loadAccounts();

    } catch (error) {

      toast.error(
        'Error al cambiar estado de la cuenta'
      );
    }
  };

  const filteredAccounts = (accounts || []).filter(account => {

    return (
      !searchTerm ||

      account.accountNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      account.type
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div
      className="p-4 md:p-6 transition-colors duration-300"
      style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}
    >

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <div>
          <h1 className="text-3xl font-bold" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
            Gestión de Cuentas
          </h1>

          <p className="text-sm mt-1" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
            Administra las cuentas bancarias del sistema
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded text-white transition font-medium"
          style={{ backgroundColor: dm ? 'var(--color-dark-success)' : 'var(--color-success)' }}
        >
          + Crear Cuenta
        </button>

      </div>

      {/* FILTROS */}
      <div
        className="rounded-xl shadow-sm p-4 mb-4 transition-colors duration-300"
        style={{
          backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)',
          border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`,
        }}
      >

        <input
          type="text"
          placeholder="Buscar por número de cuenta o tipo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded-lg focus:outline-none"
          style={{
            backgroundColor: dm ? '#0B1C2C' : '#F4F7FB',
            color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)',
            border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`,
          }}
        />

      </div>

      {/* TABLA */}
      <div
        className="rounded-xl shadow-sm overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)',
          border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`,
        }}
      >

        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead style={{ backgroundColor: dm ? 'rgba(27,79,114,0.25)' : 'rgba(214,234,248,0.55)' }}>

              <tr>
                <th className="text-left px-4 py-3 font-semibold">
                  Número de Cuenta
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  Tipo
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  Titular
                </th>

                <th className="text-right px-4 py-3 font-semibold">
                  Saldo
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  Estado
                </th>

                <th className="text-right px-4 py-3 font-semibold">
                  Acciones
                </th>
              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                    Cargando cuentas...
                  </td>
                </tr>

              ) : filteredAccounts.length === 0 ? (

                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                    No hay cuentas para mostrar.
                  </td>
                </tr>

              ) : (

                filteredAccounts.map((account) => (

                  <tr
                    key={account._id}
                    className="border-t transition"
                    style={{ borderTopColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}
                  >

                    <td className="px-4 py-3 font-medium" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
                      {account.accountNumber}
                    </td>

                    <td className="px-4 py-3" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                      {account.type}
                    </td>

                    <td className="px-4 py-3" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                      {account.user?.name || 'Usuario no encontrado'}
                    </td>

                    <td className="px-4 py-3 text-right font-medium" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>

                      Q {
                        account.balance?.toLocaleString(
                          'es-ES',
                          {
                            minimumFractionDigits: 2
                          }
                        ) || '0.00'
                      }

                    </td>

                    <td className="px-4 py-3">

                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                        backgroundColor: account.isActive ? (dm ? 'rgba(39,174,96,0.18)' : '#DCFCE7') : (dm ? 'rgba(169,204,227,0.14)' : '#E5E7EB'),
                        color: account.isActive ? (dm ? 'var(--color-dark-success)' : '#15803D') : (dm ? 'var(--color-dark-text-secondary)' : '#4B5563')
                      }}>
                        {account.isActive
                          ? 'Activa'
                          : 'Inactiva'}
                      </span>

                    </td>

                    <td className="px-4 py-3 text-right space-x-2">

                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowDetailModal(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 inline-block"
                      >
                        Ver
                      </button>

                      <button
                        onClick={() =>
                          handleChangeStatus(
                            account._id,
                            !account.isActive
                          )
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold inline-block"
                        style={{
                          backgroundColor: account.isActive ? (dm ? 'rgba(236,112,99,0.18)' : '#FEE2E2') : (dm ? 'rgba(39,174,96,0.18)' : '#DCFCE7'),
                          color: account.isActive ? (dm ? '#F5B7B1' : '#B91C1C') : (dm ? 'var(--color-dark-success)' : '#15803D')
                        }}
                      >
                        {account.isActive
                          ? 'Desactivar'
                          : 'Activar'}
                      </button>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>
        </div>

        {/* PAGINACIÓN */}
        {!loading && filteredAccounts.length > 0 && (

          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">

            <p className="text-xs" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>

              Página {pagination.currentPage}
              {' '}de{' '}
              {pagination.totalPages}

              {' '}({pagination.total} cuentas)

            </p>

            <div className="flex gap-2">

              <button
                onClick={() =>
                  setPagination({
                    ...pagination,
                    currentPage: Math.max(
                      1,
                      pagination.currentPage - 1
                    )
                  })
                }
                disabled={pagination.currentPage === 1}
                className="px-3 py-1.5 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: dm ? '#0B1C2C' : '#FFFFFF', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
              >
                Anterior
              </button>

              <span className="px-2 py-1.5 text-sm" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
                {pagination.currentPage}
                {' / '}
                {pagination.totalPages}
              </span>

              <button
                onClick={() =>
                  setPagination({
                    ...pagination,
                    currentPage: Math.min(
                      pagination.totalPages,
                      pagination.currentPage + 1
                    )
                  })
                }
                disabled={
                  pagination.currentPage ===
                  pagination.totalPages
                }
                className="px-3 py-1.5 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: dm ? '#0B1C2C' : '#FFFFFF', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
              >
                Siguiente
              </button>

            </div>
          </div>
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
          onClose={() => {
            setShowDetailModal(false);
            setSelectedAccount(null);
          }}
          onUpdate={handleUpdateAccount}
          onRefresh={loadAccounts}
          darkMode={dm}
        />

      )}
    </div>
  );
};