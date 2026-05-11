import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export const CreateTransferModal = ({ isOpen, accounts, onClose, onCreate, darkMode = false }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const fromAccount = watch('fromAccount');
  const dm = darkMode;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onCreate({
        ...data,
        amount: parseFloat(data.amount)
      });
      reset();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const fromAccountObj = accounts.find(a => a._id === fromAccount);

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
          <h2 className="text-xl sm:text-2xl font-bold">Nueva Transferencia</h2>
          <p className="text-xs sm:text-sm opacity-80">
            Realiza una transferencia entre cuentas
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                Desde *
              </label>
              <select
                {...register('fromAccount', { required: 'Selecciona la cuenta origen' })}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${errors.fromAccount ? (dm ? '#EC7063' : '#EF4444') : (dm ? 'var(--color-dark-border)' : 'var(--color-border)' )}` }}
              >
                <option value="">Seleccionar cuenta</option>
                {accounts.map(account => (
                  <option key={account._id} value={account._id}>
                    {account.accountNumber} (Q{account.balance})
                  </option>
                ))}
              </select>
              {errors.fromAccount && <p className="text-xs mt-1" style={{ color: dm ? '#F87171' : '#EF4444' }}>{errors.fromAccount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                Para *
              </label>
              <select
                {...register('toAccount', { required: 'Selecciona la cuenta destino' })}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${errors.toAccount ? (dm ? '#EC7063' : '#EF4444') : (dm ? 'var(--color-dark-border)' : 'var(--color-border)' )}` }}
              >
                <option value="">Seleccionar cuenta</option>
                {accounts.filter(a => a._id !== fromAccount).map(account => (
                  <option key={account._id} value={account._id}>
                    {account.accountNumber} ({account.type})
                  </option>
                ))}
              </select>
              {errors.toAccount && <p className="text-xs mt-1" style={{ color: dm ? '#F87171' : '#EF4444' }}>{errors.toAccount.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
              Monto (Q) *
            </label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { 
                required: 'El monto es requerido',
                min: { value: 0.01, message: 'El monto debe ser mayor a 0' }
              })}
              className="w-full px-3 py-2 rounded-lg focus:outline-none"
              style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${errors.amount ? (dm ? '#EC7063' : '#EF4444') : (dm ? 'var(--color-dark-border)' : 'var(--color-border)' )}` }}
            />
            {errors.amount && <p className="text-xs mt-1" style={{ color: dm ? '#F87171' : '#EF4444' }}>{errors.amount.message}</p>}
          </div>

          {fromAccountObj && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: dm ? 'rgba(93,173,226,0.12)' : '#EFF6FF', border: `1px solid ${dm ? 'var(--color-dark-border)' : '#BFDBFE'}` }}>
              <p className="text-xs" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>Saldo disponible: <strong>Q {fromAccountObj.balance?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</strong></p>
            </div>
          )}

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
              {loading ? 'Procesando...' : 'Realizar transferencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
