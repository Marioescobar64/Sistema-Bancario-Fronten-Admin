import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export const CreateCardModal = ({
  isOpen,
  accounts = [],
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
      // Find the selected account to extract the user ID
      const selectedAccount = accounts.find(a => a._id === data.account);
      const userId = selectedAccount?.user?._id || selectedAccount?.user;

      const payload = {
        ...data,
        user: userId
      };

      await onCreate(payload);
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
        className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transition-colors duration-300" 
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
          {/* CUENTA ASOCIADA */}
          <div>
            <label 
              className="block text-sm font-medium mb-1.5" 
              style={{ color: getColor('--color-text-secondary', '--color-dark-text-secondary') }}
            >
              Cuenta Asociada *
            </label>
            <select
              {...register('account', {
                required: 'La cuenta es requerida'
              })}
              className="w-full px-3 py-2 rounded-lg focus:outline-none transition-all"
              style={{ 
                backgroundColor: getColor('--color-background', '--color-dark-background'), 
                color: getColor('--color-text-primary', '--color-dark-text-primary'), 
                border: `1px solid ${errors.account 
                  ? getColor('--color-error', '--color-dark-error') 
                  : getColor('--color-border', '--color-dark-border')}` 
              }}
            >
              <option value="">-- Selecciona una cuenta --</option>
              {accounts.map(acc => (
                <option key={acc._id} value={acc._id}>
                  {acc.accountNumber} - {acc.user?.name} {acc.user?.lastName} ({acc.type})
                </option>
              ))}
            </select>
            {errors.account && (
              <p className="text-xs mt-1" style={{ color: getColor('--color-error', '--color-dark-error') }}>
                {errors.account.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PROPIETARIO */}
            <div>
              <label 
                className="block text-sm font-medium mb-1.5" 
                style={{ color: getColor('--color-text-secondary', '--color-dark-text-secondary') }}
              >
                Nombre Impreso en Tarjeta *
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

            {/* CATEGORÍA */}
            <div>
              <label 
                className="block text-sm font-medium mb-1.5" 
                style={{ color: getColor('--color-text-secondary', '--color-dark-text-secondary') }}
              >
                Categoría *
              </label>
              <select
                {...register('cardCategory', {
                  required: 'La categoría es requerida'
                })}
                className="w-full px-3 py-2 rounded-lg focus:outline-none transition-all"
                style={{ 
                  backgroundColor: getColor('--color-background', '--color-dark-background'), 
                  color: getColor('--color-text-primary', '--color-dark-text-primary'), 
                  border: `1px solid ${errors.cardCategory 
                    ? getColor('--color-error', '--color-dark-error') 
                    : getColor('--color-border', '--color-dark-border')}` 
                }}
              >
                <option value="">-- Selecciona --</option>
                <option value="DEBITO">Débito</option>
                <option value="CREDITO">Crédito</option>
              </select>
              {errors.cardCategory && (
                <p className="text-xs mt-1" style={{ color: getColor('--color-error', '--color-dark-error') }}>
                  {errors.cardCategory.message}
                </p>
              )}
            </div>

            {/* FRANQUICIA / TIPO */}
            <div>
              <label 
                className="block text-sm font-medium mb-1.5" 
                style={{ color: getColor('--color-text-secondary', '--color-dark-text-secondary') }}
              >
                Franquicia *
              </label>
              <select
                {...register('cardType', {
                  required: 'La franquicia es requerida'
                })}
                className="w-full px-3 py-2 rounded-lg focus:outline-none transition-all"
                style={{ 
                  backgroundColor: getColor('--color-background', '--color-dark-background'), 
                  color: getColor('--color-text-primary', '--color-dark-text-primary'), 
                  border: `1px solid ${errors.cardType 
                    ? getColor('--color-error', '--color-dark-error') 
                    : getColor('--color-border', '--color-dark-border')}` 
                }}
              >
                <option value="">-- Selecciona --</option>
                <option value="VISA">VISA</option>
                <option value="MASTERCARD">MASTERCARD</option>
              </select>
              {errors.cardType && (
                <p className="text-xs mt-1" style={{ color: getColor('--color-error', '--color-dark-error') }}>
                  {errors.cardType.message}
                </p>
              )}
            </div>

            {/* NIVEL / TIER */}
            <div>
              <label 
                className="block text-sm font-medium mb-1.5" 
                style={{ color: getColor('--color-text-secondary', '--color-dark-text-secondary') }}
              >
                Nivel (Segmentación) *
              </label>
              <select
                {...register('cardTier', {
                  required: 'El nivel es requerido'
                })}
                className="w-full px-3 py-2 rounded-lg focus:outline-none transition-all"
                style={{ 
                  backgroundColor: getColor('--color-background', '--color-dark-background'), 
                  color: getColor('--color-text-primary', '--color-dark-text-primary'), 
                  border: `1px solid ${errors.cardTier 
                    ? getColor('--color-error', '--color-dark-error') 
                    : getColor('--color-border', '--color-dark-border')}` 
                }}
              >
                <option value="">-- Selecciona --</option>
                <option value="CLASICA">Clásica</option>
                <option value="ORO">Oro</option>
                <option value="PLATINUM">Platinum</option>
                <option value="BLACK">Black</option>
                <option value="INFINITE">Infinite</option>
              </select>
              {errors.cardTier && (
                <p className="text-xs mt-1" style={{ color: getColor('--color-error', '--color-dark-error') }}>
                  {errors.cardTier.message}
                </p>
              )}
            </div>
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