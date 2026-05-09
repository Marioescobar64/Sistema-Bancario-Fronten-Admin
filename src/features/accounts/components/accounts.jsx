import React, { useState, useEffect } from 'react';
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
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gestión de Cuentas
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Administra las cuentas bancarias del sistema
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700 transition font-medium"
        >
          + Crear Cuenta
        </button>

      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">

        <input
          type="text"
          placeholder="Buscar por número de cuenta o tipo..."
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
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Cargando cuentas...
                  </td>
                </tr>

              ) : filteredAccounts.length === 0 ? (

                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No hay cuentas para mostrar.
                  </td>
                </tr>

              ) : (

                filteredAccounts.map((account) => (

                  <tr
                    key={account._id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="px-4 py-3 font-medium text-gray-800">
                      {account.accountNumber}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {account.type}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {account.user?.name || 'Usuario no encontrado'}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-gray-800">

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

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          account.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-block ${
                          account.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
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

            <p className="text-xs text-gray-600">

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
                className="px-3 py-1.5 rounded border bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <span className="px-2 py-1.5 text-sm text-gray-700">
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
                className="px-3 py-1.5 rounded border bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
        />

      )}
    </div>
  );
};