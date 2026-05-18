import { create } from "zustand";
import toast from "react-hot-toast";
import { 
    getLoans, 
    createLoan, 
    updateLoan, 
    changeLoanStatus 
} from "../../../shared/api";

export const useLoanStore = create((set, get) => ({
    loans: [],
    loading: false,
    currentLoan: null,

    fetchLoans: async (page = 1, limit = 10) => {
        set({ loading: true });
        try {
            const response = await getLoans(page, limit);
            set({ 
                loans: response?.data || [],
                loading: false 
            });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al cargar préstamos");
            throw error;
        }
    },

    createLoan: async (loanData) => {
        set({ loading: true });
        try {
            const response = await createLoan(loanData);
            toast.success("Préstamo creado exitosamente");
            await get().fetchLoans();
            set({ loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al crear préstamo");
            throw error;
        }
    },

    updateLoan: async (id, loanData) => {
        set({ loading: true });
        try {
            const response = await updateLoan(id, loanData);
            toast.success("Préstamo actualizado exitosamente");
            await get().fetchLoans();
            set({ loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al actualizar préstamo");
            throw error;
        }
    },

    changeLoanStatus: async (id, status) => {
        set({ loading: true });
        try {
            const response = await changeLoanStatus(id, status);
            toast.success("Estado del préstamo actualizado");
            await get().fetchLoans();
            set({ loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al cambiar estado");
            throw error;
        }
    },

    setCurrentLoan: (loan) => {
        set({ currentLoan: loan });
    },
}));
