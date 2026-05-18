import { create } from "zustand";
import toast from "react-hot-toast";
import { 
    getTransfers, 
    createTransfer 
} from "../../../shared/api";

export const useTransferStore = create((set, get) => ({
    transfers: [],
    loading: false,
    currentTransfer: null,

    fetchTransfers: async (page = 1, limit = 10, account = null) => {
        set({ loading: true });
        try {
            const response = await getTransfers(page, limit, account);
            set({ 
                transfers: response?.data || [],
                loading: false 
            });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al cargar transferencias");
            throw error;
        }
    },

    createTransfer: async (transferData) => {
        set({ loading: true });
        try {
            const response = await createTransfer(transferData);
            toast.success("Transferencia creada exitosamente");
            await get().fetchTransfers();
            set({ loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al crear transferencia");
            throw error;
        }
    },

    setCurrentTransfer: (transfer) => {
        set({ currentTransfer: transfer });
    },
}));
