import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const AccountDetailModal = ({ isOpen, account, onClose, onUpdate }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: account
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      reset(account);
    }
  }, [account, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onUpdate(account._id, data);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* HEADER */}
        <div
          className="p-4 sm:p-5 text-white sticky top-0 z-10"
          style={{
            background: "linear-gradient(90deg, #0066cc 0%, #1956a3 100%)",
          }}
        >
          <h2 className="text-xl sm:text-2xl font-bold">Detalle de Cuenta</h2>
          <p className="text-xs sm:text-sm opacity-80">
            Consulta y edita información de la cuenta
          </p>
        </div>

        {/* CONTENT */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 overflow-y-auto flex-1">

          {/* ACCOUNT INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Número de Cuenta</p>
              <p className="text-sm font-medium text-gray-800">{account.accountNumber}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Saldo</p>
              <p className="text-sm font-medium text-gray-800">
                Q {account.balance?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* TYPE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tipo de Cuenta
            </label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 bg-white focus:outline-none focus:border-blue-500 transition"
            >
              <option value="MONETARIA">Cuenta Monetaria</option>
              <option value="AHORRO">Cuenta de Ahorro</option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                <span className="text-sm text-gray-700">Activa</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={false}
                  {...register('isActive')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Inactiva</span>
              </label>
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition font-medium"
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
