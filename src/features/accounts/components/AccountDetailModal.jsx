import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { depositMoney, withdrawMoney } from '../../../shared/api/banking';

export const AccountDetailModal = ({ isOpen, account, onClose, onUpdate, onRefresh, darkMode = false }) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: account
  });
  const [loading, setLoading] = useState(false);
  const [operationAmount, setOperationAmount] = useState('');
  const [operationLoading, setOperationLoading] = useState(false);
  const dm = darkMode;

  useEffect(() => {
    if (account) {
      reset(account);
    }
  }, [account, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onUpdate(account._id, data);
      onRefresh?.();
    } finally {
      setLoading(false);
    }
  };

  const handleMoneyOperation = async (operation) => {
    const amount = Number(operationAmount);

    if (!amount || amount <= 0) {
      toast.error('Ingresa un monto válido');
      return;
    }

    setOperationLoading(true);

    try {
      if (operation === 'deposit') {
        await depositMoney(account.accountNumber, amount);
        toast.success('Depósito realizado correctamente');
      } else {
        await withdrawMoney(account.accountNumber, amount);
        toast.success('Retiro realizado correctamente');
      }

      setOperationAmount('');
      onRefresh?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'No se pudo completar la operación');
    } finally {
      setOperationLoading(false);
    }
  };

  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
      <div
        className="rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden transition-colors duration-300"
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
          <h2 className="text-xl sm:text-2xl font-bold">Detalle de Cuenta</h2>
          <p className="text-xs sm:text-sm opacity-80">
            Consulta y edita información de la cuenta
          </p>
        </div>

        {/* CONTENT */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 overflow-y-auto flex-1">

          {/* ACCOUNT INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg p-4" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}>
              <p className="text-xs mb-1" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>Número de Cuenta</p>
              <p className="text-sm font-medium" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>{account.accountNumber}</p>
            </div>

            <div className="rounded-lg p-4" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}>
              <p className="text-xs mb-1" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>Saldo</p>
              <p className="text-sm font-medium" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
                Q {account.balance?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: dm ? 'rgba(27,79,114,0.18)' : '#F8FAFC', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>Operaciones de dinero</h3>
              <p className="text-xs mt-1" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>Usa el número de cuenta para depositar o retirar.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>Monto</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={operationAmount}
                  onChange={(e) => setOperationAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none transition"
                  style={{ backgroundColor: dm ? '#0B1C2C' : '#FFFFFF', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  disabled={operationLoading}
                  onClick={() => handleMoneyOperation('deposit')}
                  className="flex-1 px-3 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                  style={{ backgroundColor: dm ? 'var(--color-dark-success)' : 'var(--color-success)' }}
                >
                  Depositar
                </button>
                <button
                  type="button"
                  disabled={operationLoading}
                  onClick={() => handleMoneyOperation('withdraw')}
                  className="flex-1 px-3 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                  style={{ backgroundColor: dm ? 'var(--color-dark-error)' : 'var(--color-error)' }}
                >
                  Retirar
                </button>
              </div>
            </div>
          </div>

          {/* TYPE */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
              Tipo de Cuenta
            </label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 rounded-lg focus:outline-none transition"
              style={{ backgroundColor: dm ? '#0B1C2C' : '#FFFFFF', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
            >
              <option value="MONETARIA">Cuenta Monetaria</option>
              <option value="AHORRO">Cuenta de Ahorro</option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
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
                <span className="text-sm" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>Activa</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={false}
                  {...register('isActive')}
                  className="w-4 h-4"
                />
                <span className="text-sm" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>Inactiva</span>
              </label>
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg transition font-medium"
              style={{ backgroundColor: dm ? 'var(--color-dark-background)' : 'var(--color-background)', color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
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
