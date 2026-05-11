import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  getCards,
  createCard,
  updateCard,
  changeCardStatus
} from '../../../shared/api/banking';

import { CreateCardModal } from './CreateCardModal';
import { CardDetailModal } from './CardDetailModal';

export const Cards = () => {
  const { darkMode = false } = useOutletContext() ?? {};
  const dm = darkMode;

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    loadCards();
  }, [pagination.currentPage]);

  const loadCards = async () => {

    setLoading(true);

    try {

      const response = await getCards(
        pagination.currentPage,
        10
      );

      setCards(response.data || []);

      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalRecords
      });

    } catch (error) {

      console.error(error);

      toast.error('Error al cargar tarjetas');

    } finally {

      setLoading(false);
    }
  };

  const handleCreateCard = async (cardData) => {

    try {

      await createCard(cardData);

      toast.success('Tarjeta creada exitosamente');

      setShowCreateModal(false);

      await loadCards();

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        'Error al crear tarjeta'
      );
    }
  };

  const handleUpdateCard = async (
    cardId,
    cardData
  ) => {

    try {

      await updateCard(cardId, cardData);

      toast.success(
        'Tarjeta actualizada exitosamente'
      );

      setShowDetailModal(false);

      await loadCards();

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        'Error al actualizar tarjeta'
      );
    }
  };

  const handleChangeStatus = async (
    cardId,
    isActive
  ) => {

    try {

      await changeCardStatus(cardId, isActive);

      toast.success(
        isActive
          ? 'Tarjeta activada'
          : 'Tarjeta desactivada'
      );

      await loadCards();

    } catch (error) {

      console.error(error);

      toast.error(
        'Error al cambiar estado de la tarjeta'
      );
    }
  };

  const filteredCards = cards.filter((card) => {

    return (
      !searchTerm ||

      card.cardNumbers
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      card.ownerCard
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-4 md:p-6 transition-colors duration-300" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <div>

          <h1 className="text-3xl font-bold" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
            Gestión de Tarjetas
          </h1>

          <p className="text-sm mt-1" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
            Administra las tarjetas bancarias
          </p>

        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded text-white transition font-medium"
          style={{ backgroundColor: dm ? 'var(--color-dark-success)' : 'var(--color-success)' }}
        >
          + Emitir Tarjeta
        </button>

      </div>

      {/* BUSCADOR */}
      <div className="rounded-xl shadow-sm p-4 mb-4 transition-colors duration-300" style={{ backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}>

        <input
          type="text"
          placeholder="Buscar por número o propietario..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="w-full px-3 py-2 rounded-lg focus:outline-none"
          style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
        />

      </div>

      {/* TABLA */}
      <div className="rounded-xl shadow-sm overflow-hidden transition-colors duration-300" style={{ backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}>

        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead style={{ backgroundColor: dm ? 'rgba(27,79,114,0.25)' : 'rgba(214,234,248,0.55)' }}>

              <tr>

                <th className="text-left px-4 py-3 font-semibold">
                  Número
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  Propietario
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  Expiración
                </th>

                <th className="text-left px-4 py-3 font-semibold">
                  Estado
                </th>

                <th className="text-right px-4 py-3 font-semibold">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                    Cargando tarjetas...
                  </td>
                </tr>

              ) : filteredCards.length === 0 ? (

                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                    No hay tarjetas para mostrar.
                  </td>
                </tr>

              ) : (

                filteredCards.map((card) => (

                  <tr
                    key={card._id}
                    className="border-t transition"
                    style={{ borderTopColor: dm ? 'var(--color-dark-border)' : 'var(--color-border)' }}
                  >

                    {/* NUMERO */}
                    <td className="px-4 py-3 font-medium" style={{ color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>

                      •••• {card.cardNumbers?.slice(-4)}

                    </td>

                    {/* PROPIETARIO */}
                    <td className="px-4 py-3" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>

                      {card.ownerCard}

                    </td>

                    {/* EXPIRACION */}
                    <td className="px-4 py-3" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>

                      {new Date(
                        card.expirationDate
                      ).toLocaleDateString('es-GT')}

                    </td>

                    {/* ESTADO */}
                    <td className="px-4 py-3">

                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: card.isActive ? (dm ? 'rgba(39,174,96,0.18)' : '#DCFCE7') : (dm ? 'rgba(236,112,99,0.18)' : '#FEE2E2'), color: card.isActive ? (dm ? 'var(--color-dark-success)' : '#15803D') : (dm ? '#F5B7B1' : '#B91C1C') }}
                      >
                        {card.isActive
                          ? 'Activa'
                          : 'Bloqueada'}
                      </span>

                    </td>

                    {/* ACCIONES */}
                    <td className="px-4 py-3 text-right space-x-2">

                      <button
                        onClick={() => {

                          setSelectedCard(card);

                          setShowDetailModal(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 inline-block"
                      >
                        Ver
                      </button>

                      <button
                        onClick={() =>
                          handleChangeStatus(
                            card._id,
                            !card.isActive
                          )
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold inline-block"
                        style={{ backgroundColor: card.isActive ? (dm ? 'rgba(236,112,99,0.18)' : '#FEE2E2') : (dm ? 'rgba(39,174,96,0.18)' : '#DCFCE7'), color: card.isActive ? (dm ? '#F5B7B1' : '#B91C1C') : (dm ? 'var(--color-dark-success)' : '#15803D') }}
                      >
                        {card.isActive
                          ? 'Bloquear'
                          : 'Activar'}
                      </button>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>
        </div>

        {/* PAGINACION */}
        {!loading && filteredCards.length > 0 && (

          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">

            <p className="text-xs" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>

              Página {pagination.currentPage}
              {' '}de{' '}
              {pagination.totalPages}

              {' '}({pagination.total} tarjetas)

            </p>

            <div className="flex gap-2">

              <button
                onClick={() =>
                  setPagination({
                    ...pagination,
                    currentPage: Math.max(
                      1,
                      pagination.currentPage - 1
                    )
                  })
                }
                disabled={
                  pagination.currentPage === 1
                }
                className="px-3 py-1.5 rounded text-sm disabled:opacity-50"
                style={{ backgroundColor: dm ? '#0B1C2C' : '#FFFFFF', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
              >
                Anterior
              </button>

              <button
                onClick={() =>
                  setPagination({
                    ...pagination,
                    currentPage: Math.min(
                      pagination.totalPages,
                      pagination.currentPage + 1
                    )
                  })
                }
                disabled={
                  pagination.currentPage ===
                  pagination.totalPages
                }
                className="px-3 py-1.5 rounded text-sm disabled:opacity-50"
                style={{ backgroundColor: dm ? '#0B1C2C' : '#FFFFFF', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
              >
                Siguiente
              </button>

            </div>

          </div>
        )}
      </div>

      {/* MODAL CREAR */}
      <CreateCardModal
        isOpen={showCreateModal}
        onClose={() =>
          setShowCreateModal(false)
        }
        onCreate={handleCreateCard}
        darkMode={dm}
      />

      {/* MODAL DETALLE */}
      {selectedCard && (

        <CardDetailModal
          isOpen={showDetailModal}
          card={selectedCard}
          darkMode={dm}
          onClose={() => {

            setShowDetailModal(false);

            setSelectedCard(null);
          }}
          onUpdate={handleUpdateCard}
        />
      )}
    </div>
  );
};