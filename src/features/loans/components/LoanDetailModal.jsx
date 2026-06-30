import React from 'react';

export const LoanDetailModal = ({
  isOpen,
  onClose,
  loan,
  onUpdate,
  darkMode = false
}) => {
  const dm = darkMode;

  if (!isOpen || !loan) return null;

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
          className="p-4 sm:p-5 text-white sticky top-0 z-10 flex justify-between items-center"
          style={{
            background: `linear-gradient(90deg, ${getColor('--color-primary', '--color-dark-primary')} 0%, ${getColor('--color-primary', '--color-dark-border')} 100%)`,
          }}
        >
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Detalles del Préstamo
            </h2>
            <p className="text-xs sm:text-sm opacity-80">
              ID: {loan.loanNumber || loan._id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:opacity-80"
          >
            ×
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p style={{ color: getColor('--color-text-secondary', '--color-dark-text-secondary') }} className="text-sm font-medium">
                Monto
              </p>
              <p className="text-lg font-bold">{loan.currency === 'USD' ? '$' : 'Q'} {loan.amount?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p style={{ color: getColor('--color-text-secondary', '--color-dark-text-secondary') }} className="text-sm font-medium">
                Tasa de Interés
              </p>
              <p className="text-lg font-bold">{loan.interestRate}%</p>
            </div>
            <div>
              <p style={{ color: getColor('--color-text-secondary', '--color-dark-text-secondary') }} className="text-sm font-medium">
                Plazo (meses)
              </p>
              <p className="text-lg font-bold">{loan.termMonths}</p>
            </div>
            <div>
              <p style={{ color: getColor('--color-text-secondary', '--color-dark-text-secondary') }} className="text-sm font-medium">
                Estado
              </p>
              <p className="text-lg font-bold">{loan.status}</p>
            </div>
            <div className="col-span-1 md:col-span-2">
              <p style={{ color: getColor('--color-text-secondary', '--color-dark-text-secondary') }} className="text-sm font-medium">
                Descripción
              </p>
              <p className="text-sm">{loan.description}</p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 sm:p-6 border-t flex gap-3" style={{ borderColor: getColor('--color-border', '--color-dark-border') }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-semibold text-sm flex-1"
            style={{
              backgroundColor: getColor('--color-background', '--color-dark-background'),
              color: getColor('--color-text-primary', '--color-dark-text-primary'),
              border: `1px solid ${getColor('--color-border', '--color-dark-border')}`
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
