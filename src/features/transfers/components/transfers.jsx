import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getTransfers, getAccounts, createTransfer } from '../../../shared/api/admin';

import { useDarkMode, usePaginatedList } from '../../../shared/hooks';
import {
  Pagination,
  SearchFilter,
  TableHeader,
  ActionButton,
  LoadingSpinner,
  EmptyState
} from '../../../shared/components';
import {
  getSurfaceStyle,
  getPrimaryTextStyle,
  getSecondaryTextStyle,
  getTableRowStyle
} from '../../../shared/utils/styleHelpers';

import { CreateTransferModal } from './CreateTransferModal';

export const Transfers = () => {
  const dm = useDarkMode();
  const {
    items: transfers,
    loading,
    pagination,
    loadItems,
    nextPage,
    prevPage,
    resetPage
  } = usePaginatedList(getTransfers, 10);

  const [accounts, setAccounts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadAccounts = async () => {
    try {
      const response = await getAccounts(1, 100);
      setAccounts(response.data);
    } catch (error) {
      console.error('Error al cargar cuentas:', error);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    loadItems();
  }, [pagination.currentPage, loadItems]);

  const handleCreateTransfer = async (transferData) => {
    try {
      await createTransfer(transferData);
      toast.success('Transferencia realizada exitosamente');
      setShowCreateModal(false);
      resetPage();
      await loadItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al realizar transferencia');
    }
  };

  const getAccountNumber = (accountId) => {
    const account = accounts.find(a => a._id === accountId);
    return account?.accountNumber || 'N/A';
  };

  const getAccountCurrency = (accountId) => {
    const account = accounts.find(a => a._id === accountId);
    return account?.currency === 'USD' ? '$' : 'Q';
  };

  const columns = [
    { key: 'from', label: 'De' },
    { key: 'to', label: 'Para' },
    { key: 'amount', label: 'Monto', className: 'text-right' },
    { key: 'date', label: 'Fecha' },
    { key: 'status', label: 'Estado' }
  ];

  return (
    <div className="p-4 md:p-6 transition-colors duration-300" style={getPrimaryTextStyle(dm)}>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={getPrimaryTextStyle(dm)}>Transferencias</h1>
          <p className="text-sm mt-1" style={getSecondaryTextStyle(dm)}>Historial de transferencias entre cuentas</p>
        </div>
        <ActionButton label="+ Nueva Transferencia" onClick={() => setShowCreateModal(true)} variant="success" />
      </div>

      {/* TABLA */}
      <div 
        className="rounded-xl overflow-hidden transition-all duration-300 mb-6"
        style={{
          ...getSurfaceStyle(dm),
          border: `1px solid ${dm ? 'rgba(93,173,226,0.15)' : 'rgba(31,78,121,0.1)'}`,
          boxShadow: dm 
            ? '0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(93,173,226,0.1)'
            : '0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(59,130,246,0.1)'
        }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <TableHeader columns={columns} />
            <tbody>
              {loading ? (
                <LoadingSpinner colSpan={5} message="Cargando transferencias..." />
              ) : transfers.length === 0 ? (
                <EmptyState colSpan={5} message="No hay transferencias registradas." />
              ) : (
                transfers.map((transfer, index) => (
                  <tr 
                    key={transfer._id} 
                    className="transition-all duration-200 hover:shadow-md"
                    style={{
                      backgroundColor: index % 2 === 0 
                        ? dm ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.5)'
                        : dm ? 'rgba(31,78,121,0.05)' : 'rgba(59,130,246,0.02)',
                      borderBottom: `1px solid ${dm ? 'rgba(93,173,226,0.1)' : 'rgba(31,78,121,0.08)'}`,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = dm ? 'rgba(93,173,226,0.1)' : 'rgba(59,130,246,0.06)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 
                      ? dm ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.5)'
                      : dm ? 'rgba(31,78,121,0.05)' : 'rgba(59,130,246,0.02)'}
                  >
                    <td className="px-6 py-4 md:px-4 md:py-3 font-medium" style={getPrimaryTextStyle(dm)}>
                      {getAccountNumber(transfer.fromAccount?._id || transfer.fromAccount)}
                    </td>
                    <td className="px-6 py-4 md:px-4 md:py-3" style={getSecondaryTextStyle(dm)}>
                      {getAccountNumber(transfer.toAccount?._id || transfer.toAccount)}
                    </td>
                    <td className="px-6 py-4 md:px-4 md:py-3 text-right font-medium" style={getPrimaryTextStyle(dm)}>
                      <div className="flex flex-col items-end">
                        <span>{getAccountCurrency(transfer.fromAccount?._id || transfer.fromAccount)} {transfer.amount?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                        {transfer.convertedAmount && transfer.convertedAmount !== transfer.amount && (
                          <span className="text-xs text-amber-500 italic font-normal mt-0.5">
                            (Conv: {getAccountCurrency(transfer.toAccount?._id || transfer.toAccount)} {transfer.convertedAmount?.toLocaleString('es-ES', { minimumFractionDigits: 2 })})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 md:px-4 md:py-3 text-xs" style={getSecondaryTextStyle(dm)}>
                      {new Date(transfer.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 md:px-4 md:py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                        backgroundColor: transfer.status === 'COMPLETADA' 
                          ? (dm ? 'rgba(34,197,94,0.18)' : '#DCFCE7')
                          : transfer.status === 'REVERSADA'
                          ? (dm ? 'rgba(239,68,68,0.18)' : '#FEE2E2')
                          : (dm ? 'rgba(245,158,11,0.18)' : '#FEF3C7'),
                        color: transfer.status === 'COMPLETADA'
                          ? (dm ? 'var(--color-dark-success)' : '#15803D')
                          : transfer.status === 'REVERSADA'
                          ? (dm ? '#F87171' : '#DC2626')
                          : (dm ? '#FBBF24' : '#B45309')
                      }}>
                        {transfer.status === 'COMPLETADA' ? 'Completada' 
                          : transfer.status === 'REVERSADA' ? 'Reversada'
                          : transfer.status === 'PENDIENTE' ? 'Pendiente'
                          : transfer.status === 'PROCESANDO' ? 'Procesando'
                          : transfer.status === 'FALLIDA' ? 'Fallida'
                          : transfer.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {!loading && transfers.length > 0 && (
          <Pagination
            pagination={pagination}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            itemLabel="transferencias"
            showTotal={true}
          />
        )}
      </div>

      {/* MODAL */}
      <CreateTransferModal 
        isOpen={showCreateModal}
        accounts={accounts}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTransfer}
        darkMode={dm}
      />
    </div>
  );
};
