import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const UserDetailModal = ({ isOpen, user, onClose, onUpdate, darkMode = false }) => {
  const dm = darkMode;
  const { register, handleSubmit, reset } = useForm({
    defaultValues: user
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onUpdate(user._id, data);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
      <div className="rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden transition-colors duration-300" style={{ backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`, color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>

        {/* HEADER */}
        <div
          className="p-4 sm:p-5 text-white sticky top-0 z-10"
          style={{
            background: "linear-gradient(90deg, #0066cc 0%, #1956a3 100%)",
          }}
        >
          <h2 className="text-xl sm:text-2xl font-bold">Detalle de Usuario</h2>
          <p className="text-xs sm:text-sm opacity-80">
            Consulta y edita información del usuario
          </p>
        </div>

        {/* CONTENT */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 overflow-y-auto flex-1">

          {/* USER INFO */}
          <div className="rounded-lg p-4" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}>
            <p className="text-xs mb-1" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>ID del Usuario</p>
            <p className="text-sm font-medium break-all" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>{user._id}</p>
          </div>

          {/* DATA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                Nombre
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
              />
            </div>
          </div>

          {/* ROLE */}
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
              Rol
            </label>
            <select
              {...register('role')}
              className="w-full px-3 py-2 rounded-lg focus:outline-none transition"
              style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
              Estado
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={true}
                  {...register('isActive')}
                  className="w-4 h-4"
                />
                <span className="text-sm" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>Activo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={false}
                  {...register('isActive')}
                  className="w-4 h-4"
                />
                <span className="text-sm" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>Inactivo</span>
              </label>
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t" style={{ borderTopColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg transition font-medium"
              style={{ backgroundColor: dm ? 'var(--color-dark-background)' : 'var(--color-background)', color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
            >
              Cerrar
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(90deg, #0066cc 0%, #1956a3 100%)",
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-lg text-white font-medium transition shadow disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
