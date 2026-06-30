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
      const payload = {
        user: data.user,
        type: data.type,
        currency: data.currency
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

  // Helpers para simplificar el estilo dinámico
  const getStyle = (lightVar, darkVar) => (dm ? `var(${darkVar})` : `var(${lightVar})`);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
      <div
        className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: getStyle('--color-surface', '--color-dark-surface'),
          border: `1px solid ${getStyle('--color-border', '--color-dark-border')}`,
          color: getStyle('--color-text-primary', '--color-dark-text-primary')
        }}
      >
        {/* HEADER */}
        <div
          className="p-4 sm:p-6 text-white sticky top-0 z-10"
          style={{
            background: `linear-gradient(135deg, ${getStyle('--color-primary', '--color-dark-primary')} 0%, ${getStyle('--color-secondary', '--color-dark-secondary')} 100%)`,
          }}
        >
          <h2 className="text-xl sm:text-2xl font-bold">
            Nueva Cuenta
          </h2>
          <p className="text-xs sm:text-sm opacity-90">
            Crea una nueva cuenta bancaria para un usuario
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1"
        >
          {/* USUARIO */}
          <div>
            <label 
              className="block text-sm font-semibold mb-2" 
              style={{ color: getStyle('--color-text-secondary', '--color-dark-text-secondary') }}
            >
              Usuario *
            </label>

            <select
              {...register('user', { required: 'El usuario es requerido' })}
              className="w-full px-4 py-2.5 rounded-xl focus:outline-none transition-all border-2"
              style={{
                backgroundColor: getStyle('--color-background', '--color-dark-background'),
                color: getStyle('--color-text-primary', '--color-dark-text-primary'),
                borderColor: errors.user 
                  ? getStyle('--color-error', '--color-dark-error') 
                  : getStyle('--color-border', '--color-dark-border'),
              }}
            >
              <option value="">Seleccionar usuario</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>

            {errors.user && (
              <p className="text-xs mt-1.5 font-medium" style={{ color: getStyle('--color-error', '--color-dark-error') }}>
                {errors.user.message}
              </p>
            )}
          </div>

          {/* TIPO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                className="block text-sm font-semibold mb-2" 
                style={{ color: getStyle('--color-text-secondary', '--color-dark-text-secondary') }}
              >
                Tipo de Cuenta *
              </label>

              <select
                {...register('type', { required: 'El tipo de cuenta es requerido' })}
                className="w-full px-4 py-2.5 rounded-xl focus:outline-none transition-all border-2"
                style={{
                  backgroundColor: getStyle('--color-background', '--color-dark-background'),
                  color: getStyle('--color-text-primary', '--color-dark-text-primary'),
                  borderColor: errors.type 
                    ? getStyle('--color-error', '--color-dark-error') 
                    : getStyle('--color-border', '--color-dark-border'),
                }}
              >
                <option value="">Seleccionar tipo</option>
                <option value="AHORRO">Ahorro</option>
                <option value="MONETARIA">Monetaria</option>
                <option value="PLAZO_FIJO">Plazo Fijo</option>
                <option value="AHORRO_INFANTIL">Ahorro Infantil</option>
                <option value="AHORRO_NAVIDEÑO">Ahorro Navideño</option>
              </select>

              {errors.type && (
                <p className="text-xs mt-1.5 font-medium" style={{ color: getStyle('--color-error', '--color-dark-error') }}>
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* MONEDA */}
            <div>
              <label 
                className="block text-sm font-semibold mb-2" 
                style={{ color: getStyle('--color-text-secondary', '--color-dark-text-secondary') }}
              >
                Moneda *
              </label>

              <select
                {...register('currency', { required: 'La moneda es requerida' })}
                defaultValue="GTQ"
                className="w-full px-4 py-2.5 rounded-xl focus:outline-none transition-all border-2"
                style={{
                  backgroundColor: getStyle('--color-background', '--color-dark-background'),
                  color: getStyle('--color-text-primary', '--color-dark-text-primary'),
                  borderColor: errors.currency 
                    ? getStyle('--color-error', '--color-dark-error') 
                    : getStyle('--color-border', '--color-dark-border'),
                }}
              >
                <option value="GTQ">Quetzales (GTQ)</option>
                <option value="USD">Dólares (USD)</option>
              </select>

              {errors.currency && (
                <p className="text-xs mt-1.5 font-medium" style={{ color: getStyle('--color-error', '--color-dark-error') }}>
                  {errors.currency.message}
                </p>
              )}
            </div>
          </div>

          {/* BOTONES */}
          <div 
            className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 mt-4"
            style={{ borderTop: `1px solid ${getStyle('--color-border', '--color-dark-border')}` }}
          >
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl transition font-bold border-2"
              style={{ 
                backgroundColor: 'transparent',
                color: getStyle('--color-text-secondary', '--color-dark-text-secondary'), 
                borderColor: getStyle('--color-border', '--color-dark-border')
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-2.5 rounded-xl text-white font-bold transition shadow-lg hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: getStyle('--color-primary', '--color-dark-primary'),
              }}
            >
              {loading ? 'Creando...' : 'Crear cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};