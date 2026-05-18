import { create } from "zustand";
import toast from "react-hot-toast";

export const useUserManagementStore = create((set) => ({
    settings: {},
    loading: false,

    updateSettings: async (newSettings) => {
        set({ loading: true });
        try {
            // Aquí iría la llamada a la API
            set({ settings: newSettings, loading: false });
            toast.success("Configuración actualizada");
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al actualizar configuración");
            throw error;
        }
    },
}));
