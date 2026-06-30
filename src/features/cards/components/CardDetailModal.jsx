import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { freezeCard, createExtraFinancing, getExtraFinancingsByCard } from '../../../shared/api/admin';

const LockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export const CardDetailModal = ({ isOpen, card, onClose, onUpdate, darkMode = false }) => {
  const { register, handleSubmit, reset } = useForm({ defaultValues: card });
  const [loading, setLoading] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  
  // Nuevos estados
  const [activeTab, setActiveTab] = useState('details'); // details, financing
  const [isFrozen, setIsFrozen] = useState(card?.isFrozen || false);
  const [financings, setFinancings] = useState([]);
  const [financingLoading, setFinancingLoading] = useState(false);
  
  const dm = darkMode;

  useEffect(() => {
    if (card) {
      reset(card);
      setIsFrozen(card.isFrozen || false);
      if (card.cardCategory === 'CREDITO') {
        loadFinancings(card._id);
      }
    }
  }, [card, reset]);

  const loadFinancings = async (id) => {
    try {
      const res = await getExtraFinancingsByCard(id);
      setFinancings(res.data || []);
    } catch (e) {
      console.error('Error loading financings', e);
    }
  };

  const handleToggleFreeze = async () => {
    try {
      setLoading(true);
      const res = await freezeCard(card._id);
      setIsFrozen(res.data.isFrozen);
      toast.success(res.data.isFrozen ? 'Tarjeta apagada' : 'Tarjeta encendida');
      onUpdate(card._id, res.data); // Opcional, para actualizar tabla externa
    } catch (e) {
      toast.error(e.message || 'Error al cambiar estado de la tarjeta');
    } finally {
      setLoading(false);
    }
  };

  const onFinancingSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      amount: Number(formData.get('amount')),
      installments: Number(formData.get('installments')),
      interestRate: Number(formData.get('interestRate') || 0),
      description: formData.get('description'),
    };
    
    try {
      setFinancingLoading(true);
      await createExtraFinancing(card._id, data);
      toast.success('Extra-financiamiento creado exitosamente');
      e.target.reset();
      loadFinancings(card._id);
    } catch (err) {
      toast.error(err.message || 'Error al crear financiamiento');
    } finally {
      setFinancingLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onUpdate(card._id, {
        isActive: data.isActive === 'true' || data.isActive === true,
        expirationDate: data.expirationDate || card.expirationDate,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (num = '') => {
    const s = String(num).replace(/\s/g, '');
    return s.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (date) =>
    new Date(date).toLocaleDateString('es-GT', { month: '2-digit', year: '2-digit' });

  if (!isOpen || !card) return null;

  const inputBase = `
    w-full px-3 py-2.5 text-sm rounded-lg border outline-none transition-all duration-200
    ${dm
      ? 'bg-[#0B1C2C] border-[#1B4F72] text-[#EAF2F8] placeholder-[#A9CCE3]/40 focus:border-[#5DADE2] focus:ring-1 focus:ring-[#5DADE2]/20'
      : 'bg-[#F4F7FB] border-[#D6EAF8] text-[#0A2540] focus:border-[#5DADE2] focus:ring-1 focus:ring-[#5DADE2]/20'
    }
  `;

  const disabledInput = `
    w-full px-3 py-2.5 pr-9 text-sm rounded-lg border outline-none cursor-not-allowed opacity-55
    ${dm
      ? 'bg-[#0B1C2C] border-[#1B4F72] text-[#A9CCE3]'
      : 'bg-[#F4F7FB] border-[#D6EAF8] text-[#5D6D7E]'
    }
  `;

  const labelBase = `block text-[10px] font-semibold uppercase tracking-[0.08em] mb-1.5 ${
    dm ? 'text-[#A9CCE3]' : 'text-[#5D6D7E]'
  }`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div
        className="w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden rounded-2xl transition-colors duration-300"
        style={{
          backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)',
          border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`,
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
        }}
      >
        {/* HEADER */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
        >
          <div>
            <h2
              className="text-[15px] font-semibold leading-none"
              style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}
            >
              Detalle de Tarjeta
            </h2>
            <p
              className="text-xs mt-1"
              style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}
            >
              Consulta y administra la tarjeta bancaria
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: dm ? 'var(--color-dark-background)' : 'var(--color-background)',
              border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`,
              color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {card.cardCategory === 'CREDITO' && (
          <div className="flex px-5 pt-2 border-b" style={{ borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-2 px-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'details' ? (dm ? 'border-[#5DADE2] text-[#5DADE2]' : 'border-[#1F4E79] text-[#1F4E79]') : 'border-transparent opacity-60'}`}
              style={{ color: activeTab === 'details' ? undefined : (dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)') }}
            >
              Detalles
            </button>
            <button
              onClick={() => setActiveTab('financing')}
              className={`pb-2 px-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'financing' ? (dm ? 'border-[#5DADE2] text-[#5DADE2]' : 'border-[#1F4E79] text-[#1F4E79]') : 'border-transparent opacity-60'}`}
              style={{ color: activeTab === 'financing' ? undefined : (dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)') }}
            >
              Cuotas / Extra-Financiamiento
            </button>
          </div>
        )}

        {/* CONTENIDO */}
        {activeTab === 'details' ? (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

            {/* ── TARJETA VISUAL ── */}
            <div
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: '#0A2540',
                aspectRatio: '1.586 / 1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Círculos decorativos */}
              <div className="absolute -top-14 -right-14 w-52 h-52 rounded-full" style={{ background: 'rgba(93,173,226,0.10)' }} />
              <div className="absolute -bottom-20 -left-10 w-44 h-44 rounded-full" style={{ background: 'rgba(93,173,226,0.06)' }} />

              {/* Top */}
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.06em] uppercase text-white/90">Veraff Bank</p>
                  <p className="text-[9px] text-white/40 tracking-[0.05em] mt-0.5">Tarjeta de Débito</p>
                </div>
                {/* Chip EMV */}
                <div
                  className="w-9 h-7 rounded-md flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#d4a843,#f0c96a,#c8992e)' }}
                >
                  <div
                    className="w-5 h-[14px] rounded-sm grid gap-[2px] p-[2px]"
                    style={{ border: '1.5px solid rgba(0,0,0,0.2)', gridTemplateRows: '1fr 1fr 1fr' }}
                  >
                    {[0,1,2].map(i => (
                      <div key={i} className="rounded-sm" style={{ background: 'rgba(0,0,0,0.2)' }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Número */}
              <p
                className="text-base relative z-10"
                style={{ fontFamily: "'Space Mono', monospace", letterSpacing: '0.22em', color: 'rgba(255,255,255,0.92)' }}
              >
                {formatCardNumber(card.cardNumbers)}
              </p>

              {/* Bottom */}
              <div className="flex items-end justify-between relative z-10">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.1em] text-white/40 mb-1">Propietario</p>
                  <p className="text-[12px] font-semibold uppercase text-white/90">{card.ownerCard}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.1em] text-white/40 mb-1">Expira</p>
                  <p className="text-[12px] font-semibold text-white/90">{formatExpiry(card.expirationDate)}</p>
                </div>
                <div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.04em]"
                    style={
                      card.isActive
                        ? { background: 'rgba(39,174,96,0.2)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }
                        : { background: 'rgba(231,76,60,0.2)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }
                    }
                  >
                    {card.isActive ? 'Activa' : 'Bloqueada'}
                  </span>
                </div>
              </div>
            </div>

            {/* ── PROPIETARIO (solo lectura) ── */}
            <div>
              <label className={labelBase}>Nombre del propietario</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={card.ownerCard} 
                  disabled
                  className={disabledInput} 
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40" style={{ color: dm ? '#A9CCE3' : '#5D6D7E' }}>
                  <LockIcon />
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: dm ? '#A9CCE3' : '#5D6D7E' }}>
                No se puede modificar el propietario después de emitir la tarjeta
              </p>
            </div>

            {/* ── TIPO DE TARJETA (solo lectura) ── */}
            <div>
              <label className={labelBase}>Tipo de Tarjeta</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={card.cardType || 'N/A'} 
                  disabled
                  className={disabledInput} 
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40" style={{ color: dm ? '#A9CCE3' : '#5D6D7E' }}>
                  <LockIcon />
                </span>
              </div>
            </div>

            {/* ── NÚMERO + CVV (solo lectura, en grid) ── */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelBase}>Número</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formatCardNumber(card.cardNumbers)}
                    disabled
                    className={`${disabledInput} font-mono text-xs`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40" style={{ color: dm ? '#A9CCE3' : '#5D6D7E' }}>
                    <LockIcon />
                  </span>
                </div>
              </div>
              <div>
                <label className={labelBase}>CVV</label>
                <div className="relative">
                  <input 
                    type={showCVV ? "text" : "password"} 
                    value={card.securityCode} 
                    disabled 
                    className={disabledInput} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowCVV(!showCVV)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: dm ? '#A9CCE3' : '#5D6D7E' }}
                  >
                    {showCVV ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ── FECHA (editable) ── */}
            <div>
              <label className={labelBase}>Fecha de expiración *</label>
              <div className="relative">
                <input
                  type="date"
                  {...register('expirationDate')}
                  defaultValue={new Date(card.expirationDate).toISOString().split('T')[0]}
                  className={inputBase}
                />
              </div>
            </div>

            {/* ── ESTADO ── */}
            <div>
              <label className={labelBase}>Estado de la tarjeta</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { value: 'true', label: 'Activa', dot: '#22c55e', activeBg: 'rgba(39,174,96,0.08)', activeBorder: 'rgba(39,174,96,0.3)', activeColor: '#16a34a' },
                  { value: 'false', label: 'Bloqueada', dot: '#ef4444', activeBg: 'rgba(231,76,60,0.08)', activeBorder: 'rgba(231,76,60,0.3)', activeColor: '#dc2626' },
                ].map((opt) => {
                  const isChecked = String(card.isActive) === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-200"
                      style={{
                        backgroundColor: isChecked ? opt.activeBg : (dm ? 'var(--color-dark-background)' : 'var(--color-background)'),
                        borderColor: isChecked ? opt.activeBorder : (dm ? 'var(--color-dark-border)' : 'var(--color-border)'),
                        color: isChecked ? opt.activeColor : (dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)'),
                      }}
                    >
                      <input type="radio" value={opt.value} {...register('isActive')} className="sr-only" defaultChecked={isChecked} />
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: opt.dot }} />
                      <span className="text-xs font-500">{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* ── APAGAR/ENCENDER (FREEZE) ── */}
            <div>
              <label className={labelBase}>Control de Tarjeta</label>
              <div className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: dm ? 'var(--color-dark-background)' : 'var(--color-background)', borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>Apagar Tarjeta Temporalmente</p>
                  <p className="text-xs" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>Bloquea compras y retiros temporalmente</p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleFreeze}
                  disabled={card.isBlocked || loading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isFrozen ? 'bg-[#5DADE2]' : 'bg-gray-300'} ${card.isBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFrozen ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div
            className="flex justify-end gap-2.5 px-5 py-4 flex-shrink-0"
            style={{ borderTop: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{
                backgroundColor: dm ? 'var(--color-dark-background)' : 'var(--color-background)',
                border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`,
                color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)',
              }}
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
              style={{
                backgroundColor: dm ? '#5DADE2' : '#1F4E79',
                color: dm ? '#0B1C2C' : 'white',
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  Guardar cambios
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              
              {/* Formulario para Nuevo Extra-financiamiento */}
              <div className="p-4 rounded-xl border" style={{ backgroundColor: dm ? 'var(--color-dark-background)' : 'var(--color-background)', borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>Nuevo Extra-Financiamiento</h3>
                <form onSubmit={onFinancingSubmit} className="space-y-3">
                  <div>
                    <label className={labelBase}>Monto a Financiar (Q)</label>
                    <input name="amount" type="number" step="0.01" required className={inputBase} placeholder="Ej. 5000" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelBase}>Cuotas</label>
                      <select name="installments" required className={inputBase}>
                        {[3, 6, 10, 12, 18, 24, 36, 48].map(n => <option key={n} value={n}>{n} meses</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelBase}>Tasa de Interés (%)</label>
                      <input name="interestRate" type="number" step="0.01" defaultValue="0" className={inputBase} />
                    </div>
                  </div>
                  <div>
                    <label className={labelBase}>Descripción / Concepto</label>
                    <input name="description" type="text" required className={inputBase} placeholder="Ej. Visacuotas Electrónicos" />
                  </div>
                  <button type="submit" disabled={financingLoading} className="w-full py-2 mt-2 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50" style={{ backgroundColor: dm ? '#5DADE2' : '#1F4E79' }}>
                    {financingLoading ? 'Procesando...' : 'Desembolsar Extra-Financiamiento'}
                  </button>
                </form>
              </div>

              {/* Lista de Financiamientos */}
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>Historial de Cuotas</h3>
                {financings.length === 0 ? (
                  <p className="text-xs italic" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>No hay extra-financiamientos registrados.</p>
                ) : (
                  <div className="space-y-3">
                    {financings.map(fin => (
                      <div key={fin._id} className="p-3 rounded-lg border text-sm" style={{ borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}>
                        <div className="flex justify-between font-semibold" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
                          <span>{fin.description}</span>
                          <span>Q{fin.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs mt-1" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                          <span>{fin.installments} cuotas de Q{fin.monthlyPayment.toFixed(2)}</span>
                          <span className={fin.status === 'ACTIVO' ? 'text-blue-500' : 'text-green-500'}>{fin.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};