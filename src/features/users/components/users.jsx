import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  getUsers,
  createUser,
  updateUser,
  changeUserStatus
} from '../../../shared/api/banking';

import { CreateUserModal } from './CreateUserModal';
import { UserDetailModal } from './UserDetailModal';

export const Users = () => {
  const { darkMode = false } = useOutletContext() ?? {};
  const dm = darkMode;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [pagination.currentPage]);

  const loadUsers = async () => {

    setLoading(true);

    try {

      const response = await getUsers(
        pagination.currentPage,
        10,
        true
      );

      console.log(response);

      setUsers(response?.data || []);

      setPagination({
        currentPage: response?.pagination?.currentPage || 1,
        totalPages: response?.pagination?.totalPages || 1,
        total: response?.pagination?.totalRecords || 0
      });

    } catch (error) {

      toast.error('Error al cargar usuarios');
      console.error(error);

      setUsers([]);

    } finally {

      setLoading(false);

    }
  };

  const handleCreateUser = async (userData) => {

    try {

      await createUser(userData);

      toast.success('Usuario creado exitosamente');

      setShowCreateModal(false);

      await loadUsers();

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        'Error al crear usuario'
      );

    }
  };

  const handleUpdateUser = async (userId, userData) => {

    try {

      await updateUser(userId, userData);

      toast.success('Usuario actualizado exitosamente');

      setShowDetailModal(false);

      await loadUsers();

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        'Error al actualizar usuario'
      );

    }
  };

  const handleChangeStatus = async (userId, isActive) => {

    try {

      await changeUserStatus(userId, isActive);

      toast.success(
        isActive
          ? 'Usuario activado'
          : 'Usuario desactivado'
      );

      await loadUsers();

    } catch (error) {

      toast.error(
        'Error al cambiar estado del usuario'
      );

    }
  };

  const filteredUsers = users?.filter((user) => {

    const matchSearch =
      !searchTerm ||
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole =
      !roleFilter ||
      user?.role === roleFilter;

    return matchSearch && matchRole;

  }) || [];

  return (
    <div
      className="p-4 md:p-6 transition-colors duration-300"
      style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}
    >

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <div>
          <h1 className="text-3xl font-bold" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
            Gestión de Usuarios
          </h1>

          <p className="text-sm mt-1" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
            Administra usuarios, consulta su información y cambia sus roles
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded text-white transition font-medium"
          style={{ backgroundColor: dm ? 'var(--color-dark-success)' : 'var(--color-success)' }}
        >
          + Agregar Usuario
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-2 w-full px-3 py-2 rounded-lg focus:outline-none"
            style={{
              backgroundColor: dm ? '#0B1C2C' : '#F4F7FB',
              color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)',
              border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`,
            }}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg focus:outline-none"
            style={{
              backgroundColor: dm ? '#0B1C2C' : '#F4F7FB',
              color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)',
              border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`,
            }}
          >
            <option value="">
              Todos los roles
            </option>

            <option value="ADMIN">
              ADMIN
            </option>

            <option value="USER">
              USER
            </option>
          </select>

        </div>
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

            <thead style={{ backgroundColor: dm ? 'rgba(27,79,114,0.25)' : 'rgba(214,234,248,0.55)', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>

              <tr>

                <th className="text-left px-4 py-3 font-semibold">
                  Nombre
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  Email
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  Rol
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
                  <td colSpan="5" className="px-4 py-8 text-center" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                    Cargando usuarios...
                  </td>
                </tr>

              ) : filteredUsers.length === 0 ? (

                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                    No hay usuarios para mostrar.
                  </td>
                </tr>

              ) : (

                filteredUsers.map((user) => (

                  <tr
                    key={user._id}
                    className="border-t transition"
                    style={{ borderTopColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}
                  >

                    <td className="px-4 py-3 font-medium" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
                      {user?.name || '-'}
                    </td>

                    <td className="px-4 py-3" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                      {user?.email || '-'}
                    </td>

                    <td className="px-4 py-3">

                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                        backgroundColor: user?.role === 'ADMIN' ? (dm ? 'rgba(236,112,99,0.18)' : '#FEE2E2') : (dm ? 'rgba(93,173,226,0.18)' : '#DBEAFE'),
                        color: user?.role === 'ADMIN' ? (dm ? '#F5B7B1' : '#B91C1C') : (dm ? 'var(--color-dark-primary)' : 'var(--color-primary)')
                      }}>

                        {user?.role || 'USER'}

                      </span>

                    </td>

                    <td className="px-4 py-3">

                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                        backgroundColor: user?.isActive ? (dm ? 'rgba(39,174,96,0.18)' : '#DCFCE7') : (dm ? 'rgba(169,204,227,0.14)' : '#E5E7EB'),
                        color: user?.isActive ? (dm ? 'var(--color-dark-success)' : '#15803D') : (dm ? 'var(--color-dark-text-secondary)' : '#4B5563')
                      }}>

                        {user?.isActive
                          ? 'Activo'
                          : 'Inactivo'}

                      </span>

                    </td>

                    <td className="px-4 py-3 text-right space-x-2">

                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDetailModal(true);
                        }}
                        className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold inline-block"
                        style={{ backgroundColor: dm ? 'var(--color-dark-primary)' : 'var(--color-primary)' }}
                      >
                        Ver
                      </button>

                      <button
                        onClick={() =>
                          handleChangeStatus(
                            user._id,
                            !user.isActive
                          )
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold inline-block"
                        style={{
                          backgroundColor: user?.isActive ? (dm ? 'rgba(236,112,99,0.18)' : '#FEE2E2') : (dm ? 'rgba(39,174,96,0.18)' : '#DCFCE7'),
                          color: user?.isActive ? (dm ? '#F5B7B1' : '#B91C1C') : (dm ? 'var(--color-dark-success)' : '#15803D')
                        }}
                      >

                        {user?.isActive
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
        {!loading && filteredUsers.length > 0 && (

          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">

            <p className="text-xs" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
              Página {pagination.currentPage} de {pagination.totalPages} ({pagination.total} usuarios)
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
                {pagination.currentPage} / {pagination.totalPages}
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
                disabled={pagination.currentPage === pagination.totalPages}
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
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateUser}
        darkMode={dm}
      />

      {selectedUser && (

        <UserDetailModal
          isOpen={showDetailModal}
          user={selectedUser}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedUser(null);
          }}
          onUpdate={handleUpdateUser}
          darkMode={dm}
        />

      )}
    </div>
  );
};