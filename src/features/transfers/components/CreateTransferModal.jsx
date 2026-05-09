import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export const CreateTransferModal = ({ isOpen, accounts, onClose, onCreate }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const fromAccount = watch('fromAccount');

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Desde *
              </label>
              <select
                {...register('fromAccount', { required: 'Selecciona la cuenta origen' })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                  errors.fromAccount ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
              >
                <option value="">Seleccionar cuenta</option>
                {accounts.map(account => (
                  <option key={account._id} value={account._id}>
                    {account.accountNumber} (Q{account.balance})
                  </option>
                ))}
              </select>
              {errors.fromAccount && <p className="text-red-500 text-xs mt-1">{errors.fromAccount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Para *
              </label>
              <select
                {...register('toAccount', { required: 'Selecciona la cuenta destino' })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                  errors.toAccount ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
              >
                <option value="">Seleccionar cuenta</option>
                {accounts.filter(a => a._id !== fromAccount).map(account => (
                  <option key={account._id} value={account._id}>
                    {account.accountNumber} ({account.type})
                  </option>
                ))}
              </select>
              {errors.toAccount && <p className="text-red-500 text-xs mt-1">{errors.toAccount.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Monto (Q) *
            </label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { 
                required: 'El monto es requerido',
                min: { value: 0.01, message: 'El monto debe ser mayor a 0' }
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                errors.amount ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
          </div>

          {fromAccountObj && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Saldo disponible: <strong>Q {fromAccountObj.balance?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</strong></p>
            </div>
          )}

          {/* BOTONES */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition font-medium"
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
