import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { depositMoney, withdrawMoney } from '../../../shared/api/admin';

export const AccountDetailModal = ({ isOpen, account, onClose, onUpdate, onRefresh, darkMode = false }) => {
  const { register, handleSubmit, reset } = useForm({
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

  // Helper para variables dinámicas
  const getStyle = (lightVar, darkVar) => (dm ? `var(${darkVar})` : `var(${lightVar})`);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
      <div
        className="rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden transition-colors duration-300"
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
          <h2 className="text-xl sm:text-2xl font-bold">Detalle de Cuenta</h2>
          <p className="text-xs sm:text-sm opacity-90">
            Consulta y edita información de la cuenta
          </p>
        </div>

        {/* CONTENT */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-6 overflow-y-auto flex-1">

          {/* ACCOUNT INFO CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl p-4 border" style={{ 
              backgroundColor: getStyle('--color-background', '--color-dark-background'), 
              borderColor: getStyle('--color-border', '--color-dark-border') 
            }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: getStyle('--color-text-secondary', '--color-dark-text-secondary') }}>Número de Cuenta</p>
              <p className="text-base font-bold">{account.accountNumber}</p>
            </div>

            <div className="rounded-xl p-4 border" style={{ 
              backgroundColor: getStyle('--color-background', '--color-dark-background'), 
              borderColor: getStyle('--color-border', '--color-dark-border') 
            }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: getStyle('--color-text-secondary', '--color-dark-text-secondary') }}>Saldo Actual</p>
              <p className="text-lg font-black" style={{ color: getStyle('--color-primary', '--color-dark-primary') }}>
                Q {account.balance?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* QUICK OPERATIONS SECTION */}
          <div className="rounded-2xl p-5 space-y-4 border-2 border-dashed" style={{ 
            backgroundColor: dm ? 'rgba(93, 173, 226, 0.05)' : 'rgba(214, 234, 248, 0.3)', 
            borderColor: getStyle('--color-border', '--color-dark-border') 
          }}>
            <div>
              <h3 className="text-sm font-bold" style={{ color: getStyle('--color-text-primary', '--color-dark-text-primary') }}>Operaciones de dinero</h3>
              <p className="text-xs" style={{ color: getStyle('--color-text-secondary', '--color-dark-text-secondary') }}>Gestiona depósitos y retiros inmediatos.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <input
                  type="number"
                  placeholder="Monto"
                  value={operationAmount}
                  onChange={(e) => setOperationAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none border-2 transition-all"
                  style={{ 
                    backgroundColor: getStyle('--color-surface', '--color-dark-surface'), 
                    color: getStyle('--color-text-primary', '--color-dark-text-primary'), 
                    borderColor: getStyle('--color-border', '--color-dark-border') 
                  }}
                />
              </div>

              <div className="sm:col-span-2 flex gap-2">
                <button
                  type="button"
                  disabled={operationLoading}
                  onClick={() => handleMoneyOperation('deposit')}
                  className="flex-1 px-3 py-2 rounded-lg text-white text-xs font-bold uppercase tracking-tight shadow-md transition-transform active:scale-95 disabled:opacity-50"
                  style={{ backgroundColor: getStyle('--color-success', '--color-dark-success') }}
                >
                  {operationLoading ? '...' : 'Depositar'}
                </button>
                <button
                  type="button"
                  disabled={operationLoading}
                  onClick={() => handleMoneyOperation('withdraw')}
                  className="flex-1 px-3 py-2 rounded-lg text-white text-xs font-bold uppercase tracking-tight shadow-md transition-transform active:scale-95 disabled:opacity-50"
                  style={{ backgroundColor: getStyle('--color-error', '--color-dark-error') }}
                >
                  {operationLoading ? '...' : 'Retirar'}
                </button>
              </div>
            </div>
          </div>

          {/* FORM FIELDS */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: getStyle('--color-text-secondary', '--color-dark-text-secondary') }}>
                Tipo de Cuenta
              </label>
              <select
                {...register('type')}
                className="w-full px-4 py-2.5 rounded-xl focus:outline-none border-2 transition-all"
                style={{ 
                  backgroundColor: getStyle('--color-background', '--color-dark-background'), 
                  color: getStyle('--color-text-primary', '--color-dark-text-primary'), 
                  borderColor: getStyle('--color-border', '--color-dark-border') 
                }}
              >
                <option value="MONETARIA">Cuenta Monetaria</option>
                <option value="AHORRO">Cuenta de Ahorro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: getStyle('--color-text-primary', '--color-dark-text-primary') }}>
                Estado de la Cuenta
              </label>
              <div className="flex gap-6 p-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    value={true}
                    {...register('isActive')}
                    className="w-4 h-4 accent-[#27AE60]"
                  />
                  <span className="text-sm font-medium group-hover:opacity-80" style={{ color: getStyle('--color-text-secondary', '--color-dark-text-secondary') }}>Activa</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    value={false}
                    {...register('isActive')}
                    className="w-4 h-4 accent-[#E74C3C]"
                  />
                  <span className="text-sm font-medium group-hover:opacity-80" style={{ color: getStyle('--color-text-secondary', '--color-dark-text-secondary') }}>Inactiva</span>
                </label>
              </div>
            </div>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t"
               style={{ borderTopColor: getStyle('--color-border', '--color-dark-border') }}>
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
              Cerrar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-2.5 rounded-xl text-white font-bold transition shadow-lg hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: getStyle('--color-primary', '--color-dark-primary'),
              }}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};