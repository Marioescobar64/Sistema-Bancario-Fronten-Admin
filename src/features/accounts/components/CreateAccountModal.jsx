import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export const CreateAccountModal = ({
  isOpen,
  users = [],
  onClose,
  onCreate,
  darkMode = false
}) => {
  const dm = darkMode;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    try {

      // 🔹 Formato correcto para backend
      const payload = {
        user: data.user,
        type: data.type
      };

      await onCreate(payload);

      reset();

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">

      <div
        className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)',
          border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`,
          color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)'
        }}
      >

        {/* HEADER */}
        <div
          className="p-4 sm:p-5 text-white sticky top-0 z-10"
          style={{
            background: "linear-gradient(90deg, #0066cc 0%, #1956a3 100%)",
          }}
        >
          <h2 className="text-xl sm:text-2xl font-bold">
            Nueva Cuenta
          </h2>

          <p className="text-xs sm:text-sm opacity-80">
            Crea una nueva cuenta bancaria para un usuario
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1"
        >

          {/* USUARIO */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
              Usuario *
            </label>

            <select
              {...register('user', {
                required: 'El usuario es requerido'
              })}
              className="w-full px-3 py-2 rounded-lg focus:outline-none"
              style={{
                backgroundColor: dm ? '#0B1C2C' : '#F4F7FB',
                color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)',
                border: `1px solid ${errors.user ? (dm ? '#EC7063' : '#EF4444') : (dm ? 'var(--color-dark-border)' : 'var(--color-border)')}`,
              }}
            >
              <option value="">
                Seleccionar usuario
              </option>

              {users.map((user) => (
                <option
                  key={user._id}
                  value={user._id}
                >
                  {user.name} ({user.email})
                </option>
              ))}
            </select>

            {errors.user && (
              <p className="text-xs mt-1" style={{ color: dm ? '#F87171' : '#EF4444' }}>
                {errors.user.message}
              </p>
            )}
          </div>

          {/* TIPO */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
              Tipo de Cuenta *
            </label>

            <select
              {...register('type', {
                required: 'El tipo de cuenta es requerido'
              })}
              className="w-full px-3 py-2 rounded-lg focus:outline-none"
              style={{
                backgroundColor: dm ? '#0B1C2C' : '#F4F7FB',
                color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)',
                border: `1px solid ${errors.type ? (dm ? '#EC7063' : '#EF4444') : (dm ? 'var(--color-dark-border)' : 'var(--color-border)')}`,
              }}
            >
              <option value="">
                Seleccionar tipo
              </option>

              {/* 🔹 Valores válidos para backend */}
              <option value="AHORRO">
                Cuenta de Ahorro
              </option>

              <option value="MONETARIA">
                Cuenta Monetaria
              </option>

            </select>

            {errors.type && (
              <p className="text-xs mt-1" style={{ color: dm ? '#F87171' : '#EF4444' }}>
                {errors.type.message}
              </p>
            )}
          </div>

          {/* BOTONES */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">

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
              {loading ? 'Creando...' : 'Crear cuenta'}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};