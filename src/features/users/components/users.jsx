import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import {
  getUsers,
  createUser,
  updateUser,
  changeUserStatus
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

import { CreateUserModal } from './CreateUserModal';
import { UserDetailModal } from './UserDetailModal';

export const Users = () => {
  const dm = useDarkMode();
  const {
    items: users,
    loading,
    pagination,
    loadItems,
    nextPage,
    prevPage,
    resetPage
  } = usePaginatedList(getUsers, 10);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadItems();
  }, [pagination.currentPage, loadItems]);

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData);
      toast.success('Usuario creado exitosamente');
      setShowCreateModal(false);
      resetPage();
      await loadItems();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error al crear usuario');
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      await updateUser(userId, userData);
      toast.success('Usuario actualizado exitosamente');
      setShowDetailModal(false);
      await loadItems();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  const handleChangeStatus = async (userId, isActive) => {
    try {
      await changeUserStatus(userId, isActive);
      toast.success(isActive ? 'Usuario activado' : 'Usuario desactivado');
      await loadItems();
    } catch {
      toast.error('Error al cambiar estado del usuario');
    }
  };

  const filteredUsers = (users || []).filter(user => {
    const matchSearch = !searchTerm ||
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = !roleFilter || user?.role === roleFilter;
    return matchSearch && matchRole;
  });

  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Rol' },
    { key: 'status', label: 'Estado' },
    { key: 'actions', label: 'Acciones', className: 'text-right' }
  ];

  return (
    <div className="p-4 md:p-6 transition-colors duration-300" style={getPrimaryTextStyle(dm)}>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={getPrimaryTextStyle(dm)}>
            Gestión de Usuarios
          </h1>
          <p className="text-sm mt-1" style={getSecondaryTextStyle(dm)}>
            Administra usuarios, consulta su información y cambia sus roles
          </p>
        </div>
        <ActionButton
          label="+ Agregar Usuario"
          onClick={() => setShowCreateModal(true)}
          variant="success"
        />
      </div>

      {/* BÚSQUEDA Y FILTROS */}
      <SearchFilter value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por nombre o email...">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-lg focus:outline-none"
          style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
        >
          <option value="">Todos los roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
        </select>
      </SearchFilter>

      {/* TABLA */}
      <div className="rounded-xl shadow-sm overflow-hidden transition-colors duration-300" style={getSurfaceStyle(dm)}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <TableHeader columns={columns} />
            <tbody>
              {loading ? (
                <LoadingSpinner colSpan={5} message="Cargando usuarios..." />
              ) : filteredUsers.length === 0 ? (
                <EmptyState colSpan={5} message="No hay usuarios para mostrar." />
              ) : (
                filteredUsers.map(user => (
                  <tr key={user._id} className="border-t transition" style={getTableRowStyle(dm)}>
                    <td className="px-4 py-3 font-medium" style={getPrimaryTextStyle(dm)}>
                      {user?.name || '-'}
                    </td>
                    <td className="px-4 py-3" style={getSecondaryTextStyle(dm)}>
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
                      <StatusBadge isActive={user?.isActive} activeLabel="Activo" inactiveLabel="Inactivo" />
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <ActionButton
                        label="Ver"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDetailModal(true);
                        }}
                        variant="blue"
                      />
                      <ActionButton
                        label={user?.isActive ? 'Desactivar' : 'Activar'}
                        onClick={() => handleChangeStatus(user._id, !user.isActive)}
                        variant={user?.isActive ? 'danger' : 'success'}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {!loading && filteredUsers.length > 0 && (
          <Pagination
            pagination={pagination}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            itemLabel="usuarios"
            showTotal={true}
          />
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