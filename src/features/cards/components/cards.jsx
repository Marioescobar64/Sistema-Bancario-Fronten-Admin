import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import {
  getCards,
  createCard,
  updateCard,
  changeCardStatus
} from '../../../shared/api/banking';

import { useDarkMode, usePaginatedList } from '../../../shared/hooks';
import {
  Pagination,
  SearchFilter,
  TableHeader,
  ActionButton,
  StatusBadge,
  LoadingSpinner,
  EmptyState
} from '../../../shared/components';
import {
  getSurfaceStyle,
  getPrimaryTextStyle,
  getSecondaryTextStyle,
  getTableRowStyle
} from '../../../shared/utils/styleHelpers';

import { CreateCardModal } from './CreateCardModal';
import { CardDetailModal } from './CardDetailModal';

export const Cards = () => {
  const dm = useDarkMode();
  const {
    items: cards,
    loading,
    pagination,
    loadItems,
    nextPage,
    prevPage,
    resetPage
  } = usePaginatedList(getCards, 10);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    loadItems();
  }, [pagination.currentPage, loadItems]);

  const handleCreateCard = async (cardData) => {
    try {
      await createCard(cardData);
      toast.success('Tarjeta creada exitosamente');
      setShowCreateModal(false);
      resetPage();
      await loadItems();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error al crear tarjeta');
    }
  };

  const handleUpdateCard = async (cardId, cardData) => {
    try {
      await updateCard(cardId, cardData);
      toast.success('Tarjeta actualizada exitosamente');
      setShowDetailModal(false);
      await loadItems();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error al actualizar tarjeta');
    }
  };

  const handleChangeStatus = async (cardId, isActive) => {
    try {
      await changeCardStatus(cardId);
      toast.success(isActive ? 'Tarjeta activada' : 'Tarjeta desactivada');
      await loadItems();
    } catch (error) {
      console.error(error);
      toast.error('Error al cambiar estado de la tarjeta');
    }
  };

  const formatCardNumber = (num = '') => {
    const s = String(num).replace(/\s/g, '');
    return s.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredCards = (cards || []).filter(card => {
    return !searchTerm || card.cardNumbers?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const columns = [
    { key: 'number', label: 'Número de Tarjeta' },
    { key: 'type', label: 'Tipo' },
    { key: 'holder', label: 'Propietario' },
    { key: 'expiry', label: 'Vencimiento' },
    { key: 'status', label: 'Estado' },
    { key: 'actions', label: 'Acciones', className: 'text-right' }
  ];

  return (
    <div className="p-4 md:p-6 transition-colors duration-300" style={getPrimaryTextStyle(dm)}>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={getPrimaryTextStyle(dm)}>Gestión de Tarjetas</h1>
          <p className="text-sm mt-1" style={getSecondaryTextStyle(dm)}>Administra las tarjetas bancarias</p>
        </div>
        <ActionButton label="+ Emitir Tarjeta" onClick={() => setShowCreateModal(true)} variant="success" />
      </div>

      {/* BUSCADOR */}
      <SearchFilter value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por número o propietario..." />

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
                <LoadingSpinner colSpan={6} message="Cargando tarjetas..." />
              ) : filteredCards.length === 0 ? (
                <EmptyState colSpan={6} message="No hay tarjetas para mostrar." />
              ) : (
                filteredCards.map((card, index) => (
                  <tr 
                    key={card._id} 
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
                    <td className="px-6 py-4 md:px-4 md:py-3 font-medium" style={getPrimaryTextStyle(dm)}>{formatCardNumber(card.cardNumbers) || '-'}</td>
                    <td className="px-6 py-4 md:px-4 md:py-3" style={getSecondaryTextStyle(dm)}>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ 
                        backgroundColor: card.cardType === 'VISA' ? 'rgba(30, 58, 138, 0.2)' : 
                                       card.cardType === 'MASTERCARD' ? 'rgba(235, 92, 92, 0.2)' :
                                       card.cardType === 'AMEX' ? 'rgba(39, 174, 96, 0.2)' :
                                       card.cardType === 'DINERS' ? 'rgba(142, 68, 173, 0.2)' :
                                       'rgba(155, 89, 182, 0.2)',
                        color: card.cardType === 'VISA' ? '#1E3A8A' :
                               card.cardType === 'MASTERCARD' ? '#DC2626' :
                               card.cardType === 'AMEX' ? '#16A34A' :
                               card.cardType === 'DINERS' ? '#7C3AED' :
                               '#A855F7'
                      }}>
                        {card.cardType || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 md:px-4 md:py-3" style={getSecondaryTextStyle(dm)}>{card.ownerCard || '-'}</td>
                    <td className="px-6 py-4 md:px-4 md:py-3" style={getSecondaryTextStyle(dm)}>{formatDate(card.expirationDate)}</td>
                    <td className="px-6 py-4 md:px-4 md:py-3">
                      <StatusBadge isActive={card?.isActive} activeLabel="Activa" inactiveLabel="Inactiva" />
                    </td>
                    <td className="px-6 py-4 md:px-4 md:py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <ActionButton
                          label="Ver"
                          onClick={() => {
                            setSelectedCard(card);
                            setShowDetailModal(true);
                          }}
                          variant="blue"
                        />
                        <ActionButton
                          label={card?.isActive ? 'Desactivar' : 'Activar'}
                          onClick={() => handleChangeStatus(card._id, !card.isActive)}
                          variant={card?.isActive ? 'danger' : 'success'}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {!loading && filteredCards.length > 0 && (
          <Pagination
            pagination={pagination}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            itemLabel="tarjetas"
            showTotal={true}
          />
        )}
      </div>

      {/* MODALES */}
      <CreateCardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateCard}
        darkMode={dm}
      />
      {selectedCard && (
        <CardDetailModal
          isOpen={showDetailModal}
          card={selectedCard}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedCard(null);
          }}
          onUpdate={handleUpdateCard}
          darkMode={dm}
        />
      )}
    </div>
  );
};