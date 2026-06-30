import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const DEPARTAMENTOS = [
  'Guatemala', 'Sacatepéquez', 'Chimaltenango', 'El Progreso',
  'Escuintla', 'Santa Rosa', 'Sololá', 'Totonicapán',
  'Quetzaltenango', 'Suchitepéquez', 'Retalhuleu', 'San Marcos',
  'Huehuetenango', 'Quiché', 'Baja Verapaz', 'Alta Verapaz',
  'Petén', 'Izabal', 'Zacapa', 'Chiquimula',
  'Jalapa', 'Jutiapa'
];

export const EditUserModal = ({ isOpen, user, onClose, onUpdate, darkMode = false }) => {
  const dm = darkMode;
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      reset({
        name: user.name,
        lastName: user.lastName,
        dpi: user.dpi,
        nit: user.nit,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender,
        street: user.address?.street,
        zone: user.address?.zone,
        municipality: user.address?.municipality,
        department: user.address?.department,
        occupation: user.occupation,
        monthlyIncome: user.monthlyIncome,
        incomeSource: user.incomeSource,
        role: user.role
      });
    }
  }, [user, isOpen, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        name: data.name,
        lastName: data.lastName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        address: {
          street: data.street,
          zone: parseInt(data.zone, 10),
          municipality: data.municipality,
          department: data.department
        },
        occupation: data.occupation,
        monthlyIncome: parseFloat(data.monthlyIncome),
        incomeSource: data.incomeSource,
        role: data.role
      };
      
      await onUpdate(user._id, formattedData, user.authId);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
      <div className="rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transition-colors duration-300" style={{ backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`, color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>

        <div className="p-4 sm:p-5 text-white sticky top-0 z-10 flex justify-between items-center" style={{ background: "linear-gradient(90deg, #10b981 0%, #047857 100%)" }}>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Editar Usuario</h2>
            <p className="text-xs sm:text-sm opacity-80">Modificando expediente de {user.name} {user.lastName}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Identidad Bloqueada */}
          <div className="p-3 rounded-lg border bg-gray-50 dark:bg-black/20 text-sm space-y-2" style={{ borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Identidad Inmutable</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><span className="font-semibold block text-[10px] text-gray-400">EMAIL</span>{user.email}</div>
              <div><span className="font-semibold block text-[10px] text-gray-400">DPI</span>{user.dpi}</div>
              <div><span className="font-semibold block text-[10px] text-gray-400">NIT</span>{user.nit}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-2" style={{ borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)', color: dm ? 'var(--color-dark-primary)' : 'var(--color-primary)' }}>1. Datos Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Nombres *</label>
                <input type="text" {...register('name', { required: 'Requerido' })} className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', borderColor: errors.name ? '#EF4444' : (dm ? 'var(--color-dark-border)' : 'var(--color-border)') }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Apellidos *</label>
                <input type="text" {...register('lastName', { required: 'Requerido' })} className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', borderColor: errors.lastName ? '#EF4444' : (dm ? 'var(--color-dark-border)' : 'var(--color-border)') }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Fecha Nacimiento *</label>
                <input type="date" {...register('dateOfBirth', { required: 'Requerido' })} className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', borderColor: errors.dateOfBirth ? '#EF4444' : (dm ? 'var(--color-dark-border)' : 'var(--color-border)') }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Género *</label>
                <select {...register('gender', { required: 'Requerido' })} className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', borderColor: errors.gender ? '#EF4444' : (dm ? 'var(--color-dark-border)' : 'var(--color-border)') }}>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-2" style={{ borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)', color: dm ? 'var(--color-dark-primary)' : 'var(--color-primary)' }}>2. Contacto y Dirección</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Teléfono (8 dígitos) *</label>
                <input type="text" {...register('phone', { required: 'Requerido', pattern: /^\d{8}$/ })} className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', borderColor: errors.phone ? '#EF4444' : (dm ? 'var(--color-dark-border)' : 'var(--color-border)') }} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1">Dirección (Calle/Avenida) *</label>
                <input type="text" {...register('street', { required: 'Requerido' })} className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', borderColor: errors.street ? '#EF4444' : (dm ? 'var(--color-dark-border)' : 'var(--color-border)') }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Zona *</label>
                <input type="number" {...register('zone', { required: 'Requerido', min: 1, max: 25 })} className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', borderColor: errors.zone ? '#EF4444' : (dm ? 'var(--color-dark-border)' : 'var(--color-border)') }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Municipio *</label>
                <input type="text" {...register('municipality', { required: 'Requerido' })} className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', borderColor: errors.municipality ? '#EF4444' : (dm ? 'var(--color-dark-border)' : 'var(--color-border)') }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Departamento *</label>
                <select {...register('department', { required: 'Requerido' })} className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', borderColor: errors.department ? '#EF4444' : (dm ? 'var(--color-dark-border)' : 'var(--color-border)') }}>
                  <option value="">Seleccione</option>
                  {DEPARTAMENTOS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-2" style={{ borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)', color: dm ? 'var(--color-dark-primary)' : 'var(--color-primary)' }}>3. Perfil Financiero (KYC)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Ocupación *</label>
                <input type="text" {...register('occupation', { required: 'Requerido' })} className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', borderColor: errors.occupation ? '#EF4444' : (dm ? 'var(--color-dark-border)' : 'var(--color-border)') }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Ingreso Mensual (Q) *</label>
                <input type="number" step="0.01" {...register('monthlyIncome', { required: 'Requerido' })} className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', borderColor: errors.monthlyIncome ? '#EF4444' : (dm ? 'var(--color-dark-border)' : 'var(--color-border)') }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Fuente Ingreso *</label>
                <select {...register('incomeSource', { required: 'Requerido' })} className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', borderColor: errors.incomeSource ? '#EF4444' : (dm ? 'var(--color-dark-border)' : 'var(--color-border)') }}>
                  <option value="EMPLEO">Empleo Asalariado</option>
                  <option value="NEGOCIO_PROPIO">Negocio Propio</option>
                  <option value="REMESAS">Remesas</option>
                  <option value="INVERSIONES">Inversiones</option>
                  <option value="PENSIÓN">Pensión</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-2" style={{ borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)', color: dm ? 'var(--color-dark-primary)' : 'var(--color-primary)' }}>4. Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Rol de Acceso *</label>
                <select {...register('role', { required: 'Requerido' })} className="w-full px-3 py-2 rounded-lg text-sm border focus:outline-none" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', borderColor: errors.role ? '#EF4444' : (dm ? 'var(--color-dark-border)' : 'var(--color-border)') }}>
                  <option value="USER">Cliente (USER)</option>
                  <option value="CAJERO">Cajero</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderTopColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg transition font-medium text-sm border" style={{ backgroundColor: dm ? 'var(--color-dark-background)' : 'var(--color-background)', color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)', borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg text-white font-medium text-sm transition shadow disabled:opacity-50" style={{ background: "linear-gradient(90deg, #10b981 0%, #047857 100%)" }}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
