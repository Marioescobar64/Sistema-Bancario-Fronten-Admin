import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export const CreateCardModal = ({
  isOpen,
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
      await onCreate(data);
      reset();
      onClose(); // Opcional: cerrar al terminar
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Helpers para simplificar el acceso a variables
  const getColor = (light, dark) => (dm ? `var(${dark})` : `var(${light})`);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
      <div 
        className="rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden transition-colors duration-300" 
        style={{ 
          backgroundColor: getColor('--color-surface', '--color-dark-surface'), 
          border: `1px solid ${getColor('--color-border', '--color-dark-border')}`,
          color: getColor('--color-text-primary', '--color-dark-text-primary') 
        }}
      >
        {/* HEADER */}
        <div
          className="p-4 sm:p-5 text-white sticky top-0 z-10"
          style={{
            background: `linear-gradient(90deg, ${getColor('--color-primary', '--color-dark-primary')} 0%, ${getColor('--color-primary', '--color-dark-border')} 100%)`,
          }}
        >
          <h2 className="text-xl sm:text-2xl font-bold">
            Nueva Tarjeta
          </h2>
          <p className="text-xs sm:text-sm opacity-80">
            Emitir una nueva tarjeta bancaria
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1"
        >
          {/* PROPIETARIO */}
          <div>
            <label 
              className="block text-sm font-medium mb-1.5" 
              style={{ color: getColor('--color-text-secondary', '--color-dark-text-secondary') }}
            >
              Nombre del Propietario *
            </label>
            <input
              type="text"
              placeholder="Ej: Roberto Topala"
              {...register('ownerCard', {
                required: 'El propietario es requerido'
              })}
              className="w-full px-3 py-2 rounded-lg focus:outline-none transition-all"
              style={{ 
                backgroundColor: getColor('--color-background', '--color-dark-background'), 
                color: getColor('--color-text-primary', '--color-dark-text-primary'), 
                border: `1px solid ${errors.ownerCard 
                  ? getColor('--color-error', '--color-dark-error') 
                  : getColor('--color-border', '--color-dark-border')}` 
              }}
            />
            {errors.ownerCard && (
              <p className="text-xs mt-1" style={{ color: getColor('--color-error', '--color-dark-error') }}>
                {errors.ownerCard.message}
              </p>
            )}
          </div>

          {/* INFO BOX */}
          <div 
            className="rounded-xl p-4" 
            style={{ 
              backgroundColor: dm ? 'rgba(93, 173, 226, 0.08)' : 'rgba(214, 234, 248, 0.3)', 
              border: `1px solid ${getColor('--color-border', '--color-dark-border')}` 
            }}
          >
            <p className="text-sm font-semibold mb-2" style={{ color: getColor('--color-primary', '--color-dark-primary') }}>
              La tarjeta será generada automáticamente
            </p>
            <ul className="text-xs space-y-1 list-disc pl-4" style={{ color: getColor('--color-text-secondary', '--color-dark-text-secondary') }}>
              <li>Número de tarjeta</li>
              <li>Código de seguridad (CVV)</li>
              <li>Fecha de expiración</li>
            </ul>
          </div>

          {/* BOTONES */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t" style={{ borderColor: getColor('--color-border', '--color-dark-border') }}>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg transition font-medium"
              style={{ 
                backgroundColor: 'transparent', 
                color: getColor('--color-text-secondary', '--color-dark-text-secondary'),
                border: `1px solid ${getColor('--color-border', '--color-dark-border')}`
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: getColor('--color-primary', '--color-dark-primary'),
                color: dm ? 'var(--color-dark-background)' : '#FFFFFF' // Contraste para el texto del botón
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-lg font-bold transition shadow-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Emitir tarjeta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};