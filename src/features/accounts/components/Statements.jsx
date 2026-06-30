import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAccounts, downloadStatement } from '../../../shared/api/admin';
import { useDarkMode } from '../../../shared/hooks';
import {
  getSurfaceStyle,
  getPrimaryTextStyle,
  getSecondaryTextStyle
} from '../../../shared/utils/styleHelpers';

export const Statements = () => {
  const dm = useDarkMode();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    loadAccounts();
    // Defaults: primer y último día del mes actual
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    setFromDate(firstDay.toISOString().slice(0, 10));
    setToDate(now.toISOString().slice(0, 10));
  }, []);

  const loadAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const res = await getAccounts(1, 200);
      setAccounts(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedAccount) {
      toast.error('Selecciona una cuenta');
      return;
    }
    if (!fromDate || !toDate) {
      toast.error('Selecciona un rango de fechas');
      return;
    }

    try {
      setLoading(true);
      await downloadStatement(selectedAccount, fromDate, toDate);
      toast.success('Estado de cuenta descargado');
    } catch (err) {
      toast.error(err?.message || 'Error al generar el estado de cuenta');
    } finally {
      setLoading(false);
    }
  };

  // Rangos rápidos
  const setQuickRange = (months) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    setFromDate(start.toISOString().slice(0, 10));
    setToDate(end.toISOString().slice(0, 10));
  };

  const selectedAccountData = accounts.find(a => a._id === selectedAccount);

  const inputClass = `w-full px-4 py-3 text-sm rounded-xl border outline-none transition-all duration-200
    ${dm
      ? 'bg-[#0B1C2C] border-[#1B4F72] text-[#EAF2F8] focus:border-[#5DADE2] focus:ring-1 focus:ring-[#5DADE2]/20'
      : 'bg-[#F4F7FB] border-[#D6EAF8] text-[#0A2540] focus:border-[#5DADE2] focus:ring-1 focus:ring-[#5DADE2]/20'
    }`;

  const labelClass = `block text-[10px] font-semibold uppercase tracking-[0.08em] mb-1.5 ${
    dm ? 'text-[#A9CCE3]' : 'text-[#5D6D7E]'
  }`;

  return (
    <div className="p-4 md:p-6 transition-colors duration-300" style={getPrimaryTextStyle(dm)}>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={getPrimaryTextStyle(dm)}>Estados de Cuenta</h1>
        <p className="text-sm mt-1" style={getSecondaryTextStyle(dm)}>
          Genera y descarga estados de cuenta en formato PDF
        </p>
      </div>

      {/* CONTENIDO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PANEL IZQUIERDO: Formulario */}
        <div
          className="lg:col-span-2 rounded-2xl p-6 transition-all duration-300"
          style={{
            ...getSurfaceStyle(dm),
            border: `1px solid ${dm ? 'rgba(93,173,226,0.15)' : 'rgba(31,78,121,0.1)'}`,
            boxShadow: dm
              ? '0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(93,173,226,0.1)'
              : '0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(59,130,246,0.1)'
          }}
        >
          <h2 className="text-lg font-semibold mb-5" style={getPrimaryTextStyle(dm)}>
            <svg className="inline-block w-5 h-5 mr-2 -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Generar Estado de Cuenta
          </h2>

          <div className="space-y-5">
            {/* Selector de Cuenta */}
            <div>
              <label className={labelClass}>Cuenta Bancaria</label>
              {loadingAccounts ? (
                <div className="animate-pulse h-12 rounded-xl" style={{ backgroundColor: dm ? '#1B4F72' : '#D6EAF8' }} />
              ) : (
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className={inputClass}
                >
                  <option value="">— Selecciona una cuenta —</option>
                  {accounts.map(acc => (
                    <option key={acc._id} value={acc._id}>
                      {acc.accountNumber} — {acc.type} ({acc.currency}) — {acc.user?.name || 'Sin titular'}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Rango de fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Fecha Inicio</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Fecha Fin</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Botones de rango rápido */}
            <div>
              <label className={labelClass}>Rangos Rápidos</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Este Mes', months: 0 },
                  { label: 'Último Mes', months: 1 },
                  { label: '3 Meses', months: 3 },
                  { label: '6 Meses', months: 6 },
                  { label: '1 Año', months: 12 },
                ].map(r => (
                  <button
                    key={r.months}
                    type="button"
                    onClick={() => r.months === 0 ? (() => {
                      const now = new Date();
                      setFromDate(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10));
                      setToDate(now.toISOString().slice(0, 10));
                    })() : setQuickRange(r.months)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: dm ? 'rgba(93,173,226,0.1)' : 'rgba(31,78,121,0.06)',
                      border: `1px solid ${dm ? 'rgba(93,173,226,0.2)' : 'rgba(31,78,121,0.12)'}`,
                      color: dm ? '#5DADE2' : '#1F4E79'
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Botón Descargar */}
            <button
              onClick={handleDownload}
              disabled={loading || !selectedAccount}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: dm ? '#5DADE2' : '#1F4E79' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Generando PDF...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Descargar Estado de Cuenta PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* PANEL DERECHO: Preview de cuenta */}
        <div
          className="rounded-2xl p-6 transition-all duration-300"
          style={{
            ...getSurfaceStyle(dm),
            border: `1px solid ${dm ? 'rgba(93,173,226,0.15)' : 'rgba(31,78,121,0.1)'}`,
            boxShadow: dm
              ? '0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(93,173,226,0.1)'
              : '0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(59,130,246,0.1)'
          }}
        >
          <h3 className="text-sm font-semibold mb-4" style={getPrimaryTextStyle(dm)}>
            <svg className="inline-block w-4 h-4 mr-1.5 -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            Información de Cuenta
          </h3>

          {selectedAccountData ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{
                background: dm
                  ? 'linear-gradient(135deg, #0B1C2C 0%, #1B4F72 100%)'
                  : 'linear-gradient(135deg, #1F4E79 0%, #2E86C1 100%)',
                color: 'white'
              }}>
                <p className="text-[10px] uppercase tracking-wider opacity-60 mb-1">Número de Cuenta</p>
                <p className="text-lg font-bold font-mono tracking-wide">{selectedAccountData.accountNumber}</p>
              </div>

              {[
                { label: 'Titular', value: selectedAccountData.user?.name || 'N/A' },
                { label: 'Tipo', value: selectedAccountData.type },
                { label: 'Moneda', value: selectedAccountData.currency },
                { label: 'Saldo Actual', value: `${selectedAccountData.currency === 'USD' ? '$' : 'Q'}${selectedAccountData.balance?.toLocaleString('es-GT', { minimumFractionDigits: 2 })}`, highlight: true },
                { label: 'Estado', value: selectedAccountData.isActive ? '● Activa' : '● Inactiva', isStatus: true, active: selectedAccountData.isActive },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2" style={{ borderBottom: `1px solid ${dm ? 'rgba(93,173,226,0.08)' : 'rgba(0,0,0,0.05)'}` }}>
                  <span className="text-xs" style={getSecondaryTextStyle(dm)}>{item.label}</span>
                  <span
                    className={`text-sm font-medium ${item.highlight ? 'text-base font-bold' : ''}`}
                    style={{
                      color: item.isStatus
                        ? (item.active ? '#22c55e' : '#ef4444')
                        : (dm ? '#EAF2F8' : '#0A2540')
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}

              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-wider mb-1" style={getSecondaryTextStyle(dm)}>Período seleccionado</p>
                <p className="text-xs font-medium" style={getPrimaryTextStyle(dm)}>
                  {fromDate ? new Date(fromDate + 'T00:00:00').toLocaleDateString('es-GT') : '—'} → {toDate ? new Date(toDate + 'T00:00:00').toLocaleDateString('es-GT') : '—'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto mb-3 opacity-30" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={dm ? '#5DADE2' : '#1F4E79'} strokeWidth="1.5" strokeLinecap="round">
                <rect x="2" y="3" width="20" height="18" rx="2"/>
                <line x1="2" y1="9" x2="22" y2="9"/>
              </svg>
              <p className="text-sm opacity-50" style={getSecondaryTextStyle(dm)}>
                Selecciona una cuenta para ver su información
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
