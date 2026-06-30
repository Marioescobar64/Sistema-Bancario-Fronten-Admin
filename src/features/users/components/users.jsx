import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import {
  getUsers,
  createUser,
  updateUser,
  changeUserStatus,
  preValidateUser
} from '../../../shared/api/admin';

import { register, updateUserRole } from '../../../shared/api/auth';
import { useAuthStore } from '../../../features/auth/authStore.js';

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
import { EditUserModal } from './EditUserModal';

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
  const [statusFilter, setStatusFilter] = useState('all'); // 'true', 'false', 'all'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const currentUserRole = useAuthStore(state => state.user?.role);

  // Determinar si el usuario logueado puede editar al usuario objetivo
  const canEdit = (targetUser) => {
    if (!targetUser) return false;
    if (currentUserRole === 'SUPER_ADMIN_ROLE') return true;
    if (currentUserRole === 'ADMIN_ROLE') {
      return targetUser.role !== 'SUPER_ADMIN' && targetUser.role !== 'ADMIN';
    }
    return false;
  };

  useEffect(() => {
    loadItems(statusFilter);
  }, [pagination.currentPage, loadItems, statusFilter]);

  const handleCreateUser = async (userData) => {
    try {
      // 0. Pre-validate in Banking Service
      await preValidateUser(userData);

      // 1. Create Identity in Auth Service
      const authData = new FormData();
      authData.append('name', userData.name);
      authData.append('surname', userData.lastName);
      authData.append('username', userData.email); // Use email as default username
      authData.append('email', userData.email);
      authData.append('password', userData.password);
      authData.append('phone', userData.phone);
      
      const registerRes = await register(authData);
      const userId = registerRes.data?.user?.id;

      // 2. Assign Role if not default USER
      if (userData.role !== 'USER' && userId) {
        let roleName = 'USER_ROLE';
        if (userData.role === 'ADMIN') roleName = 'ADMIN_ROLE';
        if (userData.role === 'SUPER_ADMIN') roleName = 'SUPER_ADMIN_ROLE';
        if (userData.role === 'CAJERO') roleName = 'CAJERO_ROLE';
        
        await updateUserRole(userId, roleName);
      }

      // 3. Create Profile in Banking Service
      const bankingData = {
        ...userData,
        authId: userId // Link to PostgreSQL ID
      };
      
      await createUser(bankingData);

      toast.success('Usuario creado. Se ha enviado un correo de verificación.');
      setShowCreateModal(false);
      resetPage();
      await loadItems(statusFilter);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Error al crear usuario');
    }
  };

  const handleUpdateUser = async (userId, userData, authId) => {
    try {
      // 1. Update in Banking Service
      await updateUser(userId, userData);
      
      // 2. Update Role in Auth Service if authId exists
      if (authId && userData.role) {
        let roleName = 'USER_ROLE';
        if (userData.role === 'ADMIN') roleName = 'ADMIN_ROLE';
        if (userData.role === 'SUPER_ADMIN') roleName = 'SUPER_ADMIN_ROLE';
        if (userData.role === 'CAJERO') roleName = 'CAJERO_ROLE';
        
        await updateUserRole(authId, roleName);
      }

      toast.success('Usuario actualizado exitosamente');
      setShowEditModal(false);
      await loadItems(statusFilter);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  const handleChangeStatus = async (userId, isActive) => {
    try {
      await changeUserStatus(userId, isActive);
      toast.success(isActive ? 'Usuario activado' : 'Usuario desactivado');
      await loadItems(statusFilter);
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
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
          <option value="CAJERO">CAJERO</option>
          <option value="USER">USER</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            resetPage();
          }}
          className="w-full px-3 py-2 rounded-lg focus:outline-none"
          style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
        >
          <option value="all">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
      </SearchFilter>

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
                <LoadingSpinner colSpan={5} message="Cargando usuarios..." />
              ) : filteredUsers.length === 0 ? (
                <EmptyState colSpan={5} message="No hay usuarios para mostrar." />
              ) : (
                filteredUsers.map((user, index) => (
                  <tr 
                    key={user._id} 
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
                    <td className="px-6 py-4 md:px-4 md:py-3 font-medium" style={getPrimaryTextStyle(dm)}>
                      {user?.name || '-'}
                    </td>
                    <td className="px-6 py-4 md:px-4 md:py-3" style={getSecondaryTextStyle(dm)}>
                      {user?.email || '-'}
                    </td>
                    <td className="px-6 py-4 md:px-4 md:py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                        backgroundColor: user?.role === 'ADMIN' ? (dm ? 'rgba(236,112,99,0.18)' : '#FEE2E2') : (dm ? 'rgba(93,173,226,0.18)' : '#DBEAFE'),
                        color: user?.role === 'ADMIN' ? (dm ? '#F5B7B1' : '#B91C1C') : (dm ? 'var(--color-dark-primary)' : 'var(--color-primary)')
                      }}>
                        {user?.role || 'USER'}
                      </span>
                    </td>
                    <td className="px-6 py-4 md:px-4 md:py-3">
                      <StatusBadge isActive={user?.isActive} activeLabel="Activo" inactiveLabel="Inactivo" />
                    </td>
                    <td className="px-6 py-4 md:px-4 md:py-3 text-right space-x-2">
                      <ActionButton
                        label="Ver"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDetailModal(true);
                        }}
                        variant="gray"
                      />
                      {canEdit(user) && (
                        <>
                          <ActionButton
                            label="Editar"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditModal(true);
                            }}
                            variant="blue"
                          />
                          <ActionButton
                            label={user?.isActive ? 'Desactivar' : 'Activar'}
                            onClick={() => handleChangeStatus(user._id, !user.isActive)}
                            variant={user?.isActive ? 'danger' : 'success'}
                          />
                        </>
                      )}
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
                          darkMode={dm}
                        />
                      )}
                      {selectedUser && (
                        <EditUserModal
                          isOpen={showEditModal}
                          user={selectedUser}
                          onClose={() => {
                            setShowEditModal(false);
                            setSelectedUser(null);
                          }}
                          onUpdate={handleUpdateUser}
                          darkMode={dm}
                        />
                      )}
                    </div>
  );
};