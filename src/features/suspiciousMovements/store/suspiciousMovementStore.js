import { create } from "zustand";
import toast from "react-hot-toast";
import { 
    getSuspiciousMovements, 
    updateSuspiciousMovementStatus 
} from "../../../shared/api";

export const useSuspiciousMovementStore = create((set, get) => ({
    movements: [],
    loading: false,
    currentMovement: null,

    fetchMovements: async (page = 1, limit = 10, status = null) => {
        set({ loading: true });
        try {
            const response = await getSuspiciousMovements(page, limit, status);
            set({ 
                movements: response?.data || [],
                loading: false 
            });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al cargar movimientos sospechosos");
            throw error;
        }
    },

    updateMovementStatus: async (id, reviewed) => {
        set({ loading: true });
        try {
            const response = await updateSuspiciousMovementStatus(id, reviewed);
            toast.success("Estado del movimiento actualizado");
            await get().fetchMovements();
            set({ loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al actualizar estado");
            throw error;
        }
    },

    setCurrentMovement: (movement) => {
        set({ currentMovement: movement });
    },
}));
