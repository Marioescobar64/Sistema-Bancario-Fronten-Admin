import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export const CreateLoanModal = ({ isOpen, users, onClose, onCreate }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onCreate({
        ...data,
        amount: parseFloat(data.amount),
        interestRate: parseFloat(data.interestRate),
        months: parseInt(data.months)
      });
      reset();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
          <h2 className="text-xl sm:text-2xl font-bold">Nuevo Préstamo</h2>
          <p className="text-xs sm:text-sm opacity-80">
            Crea un nuevo préstamo para un cliente
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cliente *
            </label>
            <select
              {...register('user', { required: 'El cliente es requerido' })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                errors.user ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            >
              <option value="">Seleccionar cliente</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {errors.user && <p className="text-red-500 text-xs mt-1">{errors.user.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Monto (Q) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('amount', { required: 'El monto es requerido' })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                  errors.amount ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tasa de Interés (%) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('interestRate', { required: 'La tasa es requerida' })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                  errors.interestRate ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors.interestRate && <p className="text-red-500 text-xs mt-1">{errors.interestRate.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Plazo (meses) *
            </label>
            <input
              type="number"
              {...register('months', { required: 'El plazo es requerido' })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                errors.months ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {errors.months && <p className="text-red-500 text-xs mt-1">{errors.months.message}</p>}
          </div>

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
              {loading ? 'Creando...' : 'Crear préstamo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
