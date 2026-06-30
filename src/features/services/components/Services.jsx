import React, { useState, useEffect } from 'react';
import { usePaginatedList, useDarkMode } from '../../../shared/hooks';
import { getSurfaceStyle, getPrimaryTextStyle, getSecondaryTextStyle } from '../../../shared/utils/styleHelpers';
import { Pagination, LoadingSpinner, EmptyState } from '../../../shared/components';
import { axiosAdmin } from '../../../shared/api/api';
import toast from 'react-hot-toast';

const getServicePayments = async (page = 1, limit = 10) => {
    const { data } = await axiosAdmin.get('/services', { params: { page, limit } });
    return data;
};

const getAccounts = async () => {
    const { data } = await axiosAdmin.get('/accounts', { params: { page: 1, limit: 100 } });
    return data;
};

const createServicePayment = async (paymentData) => {
    const { data } = await axiosAdmin.post('/services', paymentData);
    return data;
};

export const Services = () => {
  const dm = useDarkMode();
  const [showModal, setShowModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    accountId: '',
    serviceProvider: 'EEGSA',
    referenceNumber: '',
    amount: ''
  });

  const {
    items: payments,
    loading,
    pagination,
    loadItems,
    goToPage,
    nextPage,
    prevPage
  } = usePaginatedList(getServicePayments);

  useEffect(() => {
    loadItems();
    getAccounts().then(res => setAccounts(res.data)).catch(console.error);
  }, [loadItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createServicePayment({
        accountId: formData.accountId,
        serviceProvider: formData.serviceProvider,
        referenceNumber: formData.referenceNumber,
        amount: parseFloat(formData.amount)
      });
      toast.success('Pago de servicio procesado correctamente');
      setShowModal(false);
      setFormData({ ...formData, referenceNumber: '', amount: '' });
      loadItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar el pago');
    }
  };

  return (
    <div className="p-4 md:p-6 transition-colors duration-300" style={{color: dm ? '#fff' : '#000'}}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Historial de Pagos de Servicios</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg font-medium text-white shadow-md transition-colors duration-300 bg-blue-600 hover:bg-blue-700"
        >
          Pagar Nuevo Servicio
        </button>
      </div>

      <div className="rounded-xl shadow-sm overflow-hidden" style={getSurfaceStyle(dm)}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b" style={{borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)'}}>
                <th className="p-4 font-semibold" style={getSecondaryTextStyle(dm)}>Fecha</th>
                <th className="p-4 font-semibold" style={getSecondaryTextStyle(dm)}>Proveedor</th>
                <th className="p-4 font-semibold" style={getSecondaryTextStyle(dm)}>Referencia</th>
                <th className="p-4 font-semibold" style={getSecondaryTextStyle(dm)}>Recibo</th>
                <th className="p-4 font-semibold" style={getSecondaryTextStyle(dm)}>Monto</th>
                <th className="p-4 font-semibold" style={getSecondaryTextStyle(dm)}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <LoadingSpinner colSpan={6} />
              ) : payments.length === 0 ? (
                <EmptyState colSpan={6} message="No hay pagos registrados." />
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)'}}>
                    <td className="p-4" style={getPrimaryTextStyle(dm)}>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-medium" style={getPrimaryTextStyle(dm)}>{p.serviceProvider}</td>
                    <td className="p-4" style={getSecondaryTextStyle(dm)}>{p.referenceNumber}</td>
                    <td className="p-4" style={getSecondaryTextStyle(dm)}>{p.receiptNumber}</td>
                    <td className="p-4 font-bold" style={getPrimaryTextStyle(dm)}>Q {p.amount.toFixed(2)}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination pagination={pagination} onPrevPage={prevPage} onNextPage={nextPage} onGoToPage={goToPage} />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl shadow-xl p-6" style={getSurfaceStyle(dm)}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold" style={getPrimaryTextStyle(dm)}>Pago de Servicio</h3>
              <button onClick={() => setShowModal(false)} className="text-2xl hover:opacity-70 transition-opacity" style={getSecondaryTextStyle(dm)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium" style={getSecondaryTextStyle(dm)}>Cuenta a Debitar</label>
                <select
                  required
                  value={formData.accountId}
                  onChange={e => setFormData({...formData, accountId: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none"
                  style={{...getPrimaryTextStyle(dm), borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)'}}
                >
                  <option value="">Seleccione una cuenta</option>
                  {accounts.map(acc => (
                    <option key={acc._id} value={acc._id} className="dark:bg-gray-800">
                      {acc.accountNumber} ({acc.currency}) - Q{acc.balance.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium" style={getSecondaryTextStyle(dm)}>Proveedor</label>
                <select
                  required
                  value={formData.serviceProvider}
                  onChange={e => setFormData({...formData, serviceProvider: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none"
                  style={{...getPrimaryTextStyle(dm), borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)'}}
                >
                  <option value="EEGSA" className="dark:bg-gray-800">EEGSA (Luz)</option>
                  <option value="ENERGUATE" className="dark:bg-gray-800">ENERGUATE (Luz)</option>
                  <option value="EMPAGUA" className="dark:bg-gray-800">EMPAGUA (Agua)</option>
                  <option value="TIGO" className="dark:bg-gray-800">TIGO (Telefonía/Internet)</option>
                  <option value="CLARO" className="dark:bg-gray-800">CLARO (Telefonía/Internet)</option>
                  <option value="SAT" className="dark:bg-gray-800">SAT (Impuestos/Declaraguate)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium" style={getSecondaryTextStyle(dm)}>Número de Referencia (NIS / Teléfono)</label>
                <input
                  type="text"
                  required
                  value={formData.referenceNumber}
                  onChange={e => setFormData({...formData, referenceNumber: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none"
                  style={{...getPrimaryTextStyle(dm), borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)'}}
                  placeholder="Ej. 12345678"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium" style={getSecondaryTextStyle(dm)}>Monto a Pagar (Q)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none"
                  style={{...getPrimaryTextStyle(dm), borderColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)'}}
                  placeholder="0.00"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={getSecondaryTextStyle(dm)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-medium text-white shadow-md transition-colors bg-blue-600 hover:bg-blue-700"
                >
                  Pagar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
