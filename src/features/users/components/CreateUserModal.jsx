import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export const CreateUserModal = ({ isOpen, onClose, onCreate, darkMode = false }) => {
  const dm = darkMode;
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onCreate(data);
      reset();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
      <div className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transition-colors duration-300" style={{ backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`, color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>

        {/* HEADER */}
        <div
          className="p-4 sm:p-5 text-white sticky top-0 z-10"
          style={{
            background: "linear-gradient(90deg, #0066cc 0%, #1956a3 100%)",
          }}
        >
          <h2 className="text-xl sm:text-2xl font-bold">Nuevo Usuario</h2>
          <p className="text-xs sm:text-sm opacity-80">
            Completa la información para registrar un nuevo usuario
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                Nombre *
              </label>
              <input
                type="text"
                {...register('name', { required: 'El nombre es requerido' })}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${errors.name ? (dm ? '#EC7063' : '#EF4444') : (dm ? 'var(--color-dark-border)' : 'var(--color-border)' )}` }}
              />
              {errors.name && <p className="text-xs mt-1" style={{ color: dm ? '#F87171' : '#EF4444' }}>{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                Email *
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'El email es requerido',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' }
                })}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${errors.email ? (dm ? '#EC7063' : '#EF4444') : (dm ? 'var(--color-dark-border)' : 'var(--color-border)' )}` }}
              />
              {errors.email && <p className="text-xs mt-1" style={{ color: dm ? '#F87171' : '#EF4444' }}>{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
              Contraseña *
            </label>
            <input
              type="password"
              {...register('password', { required: 'La contraseña es requerida' })}
              className="w-full px-3 py-2 rounded-lg focus:outline-none"
              style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${errors.password ? (dm ? '#EC7063' : '#EF4444') : (dm ? 'var(--color-dark-border)' : 'var(--color-border)' )}` }}
            />
            {errors.password && <p className="text-xs mt-1" style={{ color: dm ? '#F87171' : '#EF4444' }}>{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
              Rol *
            </label>
            <select
              {...register('role', { required: 'El rol es requerido' })}
              className="w-full px-3 py-2 rounded-lg focus:outline-none"
              style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${errors.role ? (dm ? '#EC7063' : '#EF4444') : (dm ? 'var(--color-dark-border)' : 'var(--color-border)' )}` }}
            >
              <option value="">Seleccionar rol</option>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>
            {errors.role && <p className="text-xs mt-1" style={{ color: dm ? '#F87171' : '#EF4444' }}>{errors.role.message}</p>}
          </div>

          {/* BOTONES */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t" style={{ borderTopColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg transition font-medium"
              style={{ backgroundColor: dm ? 'var(--color-dark-background)' : 'var(--color-background)', color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(90deg, #0066cc 0%, #1956a3 100%)",
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-lg text-white font-medium transition shadow disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
