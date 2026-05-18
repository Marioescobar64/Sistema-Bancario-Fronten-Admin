import { create } from "zustand";
import toast from "react-hot-toast";
import { 
    getCards, 
    createCard, 
    updateCard, 
    changeCardStatus 
} from "../../../shared/api";

export const useCardStore = create((set, get) => ({
    cards: [],
    loading: false,
    currentCard: null,

    fetchCards: async (page = 1, limit = 10) => {
        set({ loading: true });
        try {
            const response = await getCards(page, limit);
            set({ 
                cards: response?.data || [],
                loading: false 
            });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al cargar tarjetas");
            throw error;
        }
    },

    createCard: async (cardData) => {
        set({ loading: true });
        try {
            const response = await createCard(cardData);
            toast.success("Tarjeta creada exitosamente");
            await get().fetchCards();
            set({ loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al crear tarjeta");
            throw error;
        }
    },

    updateCard: async (id, cardData) => {
        set({ loading: true });
        try {
            const response = await updateCard(id, cardData);
            toast.success("Tarjeta actualizada exitosamente");
            await get().fetchCards();
            set({ loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al actualizar tarjeta");
            throw error;
        }
    },

    changeCardStatus: async (id, isActive) => {
        set({ loading: true });
        try {
            const response = await changeCardStatus(id, isActive);
            toast.success("Estado de la tarjeta actualizado");
            await get().fetchCards();
            set({ loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al cambiar estado");
            throw error;
        }
    },

    setCurrentCard: (card) => {
        set({ currentCard: card });
    },
}));
