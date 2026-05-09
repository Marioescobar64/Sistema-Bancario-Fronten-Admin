import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export const CreateCardModal = ({
  isOpen,
  onClose,
  onCreate
}) => {

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

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* HEADER */}
        <div
          className="p-4 sm:p-5 text-white sticky top-0 z-10"
          style={{
            background:
              "linear-gradient(90deg, #0066cc 0%, #1956a3 100%)",
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

            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre del Propietario *
            </label>

            <input
              type="text"
              placeholder="Ej: Roberto Topala"
              {...register('ownerCard', {
                required: 'El propietario es requerido'
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                errors.ownerCard
                  ? 'border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />

            {errors.ownerCard && (
              <p className="text-red-500 text-xs mt-1">
                {errors.ownerCard.message}
              </p>
            )}

          </div>

          {/* INFO */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">

            <p className="text-sm font-semibold text-blue-800 mb-2">
              La tarjeta será generada automáticamente
            </p>

            <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">

              <li>Número de tarjeta</li>

              <li>Código de seguridad (CVV)</li>

              <li>Fecha de expiración</li>

            </ul>

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
                background:
                  "linear-gradient(90deg, #0066cc 0%, #1956a3 100%)",
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-lg text-white font-medium transition shadow disabled:opacity-50"
            >
              {loading
                ? 'Creando...'
                : 'Emitir tarjeta'}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};