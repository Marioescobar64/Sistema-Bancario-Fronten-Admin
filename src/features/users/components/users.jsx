import React, { useState, useEffect } from 'react';
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
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gestión de Usuarios
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Administra usuarios, consulta su información y cambia sus roles
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700 transition font-medium"
        >
          + Agregar Usuario
        </button>

      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead className="bg-gray-50 text-gray-700">

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
                  <td
                    colSpan="5"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Cargando usuarios...
                  </td>
                </tr>

              ) : filteredUsers.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No hay usuarios para mostrar.
                  </td>
                </tr>

              ) : (

                filteredUsers.map((user) => (

                  <tr
                    key={user._id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="px-4 py-3 font-medium text-gray-800">
                      {user?.name || '-'}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {user?.email || '-'}
                    </td>

                    <td className="px-4 py-3">

                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user?.role === 'ADMIN'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>

                        {user?.role || 'USER'}

                      </span>

                    </td>

                    <td className="px-4 py-3">

                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user?.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>

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
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 inline-block"
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-block ${
                          user?.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
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

            <p className="text-xs text-gray-600">
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
                className="px-3 py-1.5 rounded border bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <span className="px-2 py-1.5 text-sm text-gray-700">
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
                className="px-3 py-1.5 rounded border bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
        />

      )}
    </div>
  );
};