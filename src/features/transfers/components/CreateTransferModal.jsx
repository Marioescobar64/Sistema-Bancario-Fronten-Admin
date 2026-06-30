import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export const CreateTransferModal = ({ isOpen, accounts, onClose, onCreate, darkMode = false }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const fromAccount = watch('fromAccount');
  const toAccount = watch('toAccount');
  const amount = watch('amount');
  const transferType = watch('transferType');
  const dm = darkMode;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onCreate({
        ...data,
        amount: parseFloat(data.amount),
        channel: 'VENTANILLA' // Desde el panel de administración
      });
      reset();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const fromAccountObj = accounts.find(a => a._id === fromAccount);
  const toAccountObj = accounts.find(a => a._id === toAccount);
  const isInterbank = transferType === 'INTERBANCARIA_ACH' || transferType === 'INTERBANCARIA_LBTR' || transferType === 'INTERNACIONAL';

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
            Realiza una transferencia desde el sistema central (Ventanilla)
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                Cuenta de Origen *
              </label>
              <select
                {...register('fromAccount', { required: 'Selecciona la cuenta origen' })}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${errors.fromAccount ? (dm ? '#EC7063' : '#EF4444') : (dm ? 'var(--color-dark-border)' : 'var(--color-border)' )}` }}
              >
                <option value="">Seleccionar cuenta</option>
                {accounts.map(account => (
                  <option key={account._id} value={account._id}>
                    {account.accountNumber} ({account.currency === 'USD' ? '$' : 'Q'}{account.balance?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}) - {account.user?.name}
                  </option>
                ))}
              </select>
              {errors.fromAccount && <p className="text-xs mt-1" style={{ color: dm ? '#F87171' : '#EF4444' }}>{errors.fromAccount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                Tipo de Transferencia *
              </label>
              <select
                {...register('transferType', { required: 'El tipo es requerido' })}
                defaultValue="INTERNA"
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${errors.transferType ? (dm ? '#EC7063' : '#EF4444') : (dm ? 'var(--color-dark-border)' : 'var(--color-border)' )}` }}
              >
                <option value="INTERNA">Interna (Mismo Banco)</option>
                <option value="INTERBANCARIA_ACH">ACH (Otros Bancos)</option>
                <option value="INTERBANCARIA_LBTR">LBTR (Tiempo Real)</option>
                <option value="INTERNACIONAL">Internacional (SWIFT)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                Cuenta de Destino {isInterbank ? '(ID Interno)' : '*'}
              </label>
              <select
                {...register('toAccount', { required: !isInterbank ? 'Selecciona la cuenta destino' : false })}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${errors.toAccount ? (dm ? '#EC7063' : '#EF4444') : (dm ? 'var(--color-dark-border)' : 'var(--color-border)' )}` }}
              >
                <option value="">Seleccionar cuenta interna</option>
                {accounts.filter(a => a._id !== fromAccount).map(account => (
                  <option key={account._id} value={account._id}>
                    {account.accountNumber} ({account.type}) - {account.user?.name}
                  </option>
                ))}
              </select>
              {errors.toAccount && <p className="text-xs mt-1" style={{ color: dm ? '#F87171' : '#EF4444' }}>{errors.toAccount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                Moneda *
              </label>
              <select
                {...register('currency', { required: 'La moneda es requerida' })}
                defaultValue="GTQ"
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${errors.currency ? (dm ? '#EC7063' : '#EF4444') : (dm ? 'var(--color-dark-border)' : 'var(--color-border)' )}` }}
              >
                <option value="GTQ">Quetzales (GTQ)</option>
                <option value="USD">Dólares (USD)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
              Monto (Q / $) *
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
            {fromAccountObj && toAccountObj && fromAccountObj.currency !== toAccountObj.currency && Number(amount) > 0 && (
              <div className="mt-2 p-2.5 rounded-lg border" style={{ backgroundColor: dm ? 'rgba(245, 158, 11, 0.1)' : '#FFFBEB', borderColor: dm ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7' }}>
                <p className="text-xs font-medium" style={{ color: dm ? '#FBBF24' : '#B45309' }}>
                  ⚠️ Tasa de cambio: 7.80. El destinatario recibirá: {toAccountObj.currency === 'USD' ? '$' : 'Q'}{fromAccountObj.currency === 'GTQ' ? (Number(amount) / 7.80).toFixed(2) : (Number(amount) * 7.80).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {fromAccountObj && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: dm ? 'rgba(93,173,226,0.12)' : '#EFF6FF', border: `1px solid ${dm ? 'var(--color-dark-border)' : '#BFDBFE'}` }}>
              <p className="text-xs" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>Saldo disponible: <strong>{fromAccountObj.currency} {fromAccountObj.balance?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</strong></p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
              Descripción / Concepto
            </label>
            <input
              type="text"
              {...register('description')}
              placeholder="Ej: Pago de planilla"
              className="w-full px-3 py-2 rounded-lg focus:outline-none"
              style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
            />
          </div>

          {/* CAMPOS BENEFICIARIO INTERBANCARIO */}
          {isInterbank && (
            <div className="p-4 rounded-lg border space-y-3 mt-4" style={{ backgroundColor: dm ? 'rgba(0,0,0,0.2)' : '#F9FAFB', borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>
              <h4 className="text-xs font-bold uppercase" style={{ color: dm ? 'var(--color-dark-primary)' : 'var(--color-primary)' }}>Datos del Beneficiario Externo</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>Nombre Beneficiario</label>
                  <input type="text" {...register('beneficiary.name', { required: isInterbank ? 'Requerido para interbancaria' : false })} className="w-full px-3 py-1.5 rounded-lg text-sm focus:outline-none border" style={{ backgroundColor: dm ? '#0B1C2C' : '#FFFFFF', borderColor: errors.beneficiary?.name ? '#EF4444' : (dm ? 'var(--color-dark-border)' : 'var(--color-border)') }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>Banco Destino</label>
                  <input type="text" {...register('beneficiary.bankName', { required: isInterbank ? 'Requerido' : false })} className="w-full px-3 py-1.5 rounded-lg text-sm focus:outline-none border" style={{ backgroundColor: dm ? '#0B1C2C' : '#FFFFFF', borderColor: errors.beneficiary?.bankName ? '#EF4444' : (dm ? 'var(--color-dark-border)' : 'var(--color-border)') }} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>No. Cuenta Destino</label>
                  <input type="text" {...register('beneficiary.accountNumber', { required: isInterbank ? 'Requerido' : false })} className="w-full px-3 py-1.5 rounded-lg text-sm focus:outline-none border" style={{ backgroundColor: dm ? '#0B1C2C' : '#FFFFFF', borderColor: errors.beneficiary?.accountNumber ? '#EF4444' : (dm ? 'var(--color-dark-border)' : 'var(--color-border)') }} />
                </div>
              </div>
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
