import React from 'react';
import { StatusBadge } from '../../../shared/components/StatusBadge';
import { getPrimaryTextStyle, getSecondaryTextStyle } from '../../../shared/utils/styleHelpers';

export const UserDetailModal = ({ isOpen, user, onClose, darkMode = false }) => {
  const dm = darkMode;

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
      <div 
        className="rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden transition-colors duration-300"
        style={{ 
          backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)',
          border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`,
        }}
      >
        {/* HEADER */}
        <div className="p-4 sm:p-6 text-white sticky top-0 z-10 flex justify-between items-center" style={{ background: "linear-gradient(90deg, #0066cc 0%, #1956a3 100%)" }}>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
              Expediente del Cliente
              <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full font-medium">ID: {user._id?.substring(0,8)}...</span>
            </h2>
            <p className="text-sm opacity-90 mt-1">{user.name} {user.lastName}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 flex flex-col items-center p-4 rounded-xl border" style={{ borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)', backgroundColor: dm ? 'rgba(0,0,0,0.2)' : '#F9FAFB' }}>
              <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold mb-3 border-4 border-white shadow-sm">
                {user.name?.charAt(0)}{user.lastName?.charAt(0)}
              </div>
              <h3 className="font-bold text-center text-lg" style={getPrimaryTextStyle(dm)}>{user.name} {user.lastName}</h3>
              <p className="text-xs text-center mb-3" style={getSecondaryTextStyle(dm)}>{user.email}</p>
              
              <div className="flex gap-2 flex-wrap justify-center mb-2">
                <StatusBadge isActive={user.isActive} />
                <span className="px-2 py-1 text-[10px] font-bold rounded-md bg-blue-100 text-blue-700">{user.role}</span>
              </div>
            </div>

            <div className="col-span-2 space-y-4">
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2 border-b pb-1" style={{ color: dm ? 'var(--color-dark-primary)' : 'var(--color-primary)', borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>Información Personal</h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <InfoItem label="DPI" value={user.dpi} dm={dm} />
                  <InfoItem label="NIT" value={user.nit} dm={dm} />
                  <InfoItem label="Teléfono" value={user.phone} dm={dm} />
                  <InfoItem label="Fecha de Nac." value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '-'} dm={dm} />
                  <InfoItem label="Género" value={user.gender === 'M' ? 'Masculino' : 'Femenino'} dm={dm} />
                  <InfoItem label="Nacionalidad" value={user.nationality} dm={dm} />
                </div>
              </div>

            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 border-b pb-1" style={{ color: dm ? 'var(--color-dark-primary)' : 'var(--color-primary)', borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>Dirección Residencial</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg" style={{ backgroundColor: dm ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
              <InfoItem label="Calle/Avenida" value={user.address?.street} dm={dm} fullWidth />
              <InfoItem label="Zona" value={user.address?.zone} dm={dm} />
              <InfoItem label="Municipio" value={user.address?.municipality} dm={dm} />
              <InfoItem label="Departamento" value={user.address?.department} dm={dm} />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 border-b pb-1" style={{ color: dm ? 'var(--color-dark-primary)' : 'var(--color-primary)', borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>Perfil KYC (Conozca a su Cliente)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg border" style={{ borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)', backgroundColor: user.riskLevel === 'ALTO' ? (dm ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)') : 'transparent' }}>
              <InfoItem label="Ocupación" value={user.occupation} dm={dm} />
              <InfoItem label="Ingreso Mensual" value={user.monthlyIncome ? `Q ${user.monthlyIncome.toLocaleString()}` : '-'} dm={dm} />
              <InfoItem label="Fuente Ingreso" value={user.incomeSource} dm={dm} />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>Nivel de Riesgo</span>
                <span className={`text-sm font-medium ${user.riskLevel === 'ALTO' ? 'text-red-500' : 'text-green-500'}`}>{user.riskLevel || 'BAJO'}</span>
              </div>
              <div className="flex flex-col sm:col-span-2">
                <span className="text-[10px] uppercase font-bold" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>Persona Expuesta Políticamente (PEP)</span>
                <span className={`text-sm font-bold ${user.isPEP ? 'text-red-500' : (dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)')}`}>{user.isPEP ? 'SÍ, MARCAR PARA REVISIÓN' : 'NO'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, dm, fullWidth = false }) => (
  <div className={`flex flex-col ${fullWidth ? 'col-span-full' : ''}`}>
    <span className="text-[10px] uppercase font-bold mb-0.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>{label}</span>
    <span className="text-sm font-medium" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>{value || '-'}</span>
  </div>
);
