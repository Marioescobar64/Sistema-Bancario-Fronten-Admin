import { create } from "zustand";
import toast from "react-hot-toast";
import { 
    getUsers, 
    createUser, 
    updateUser, 
    changeUserStatus,
    getUserById 
} from "../../../shared/api";

export const useUserStore = create((set, get) => ({
    users: [],
    loading: false,
    currentUser: null,

    fetchUsers: async (page = 1, limit = 10) => {
        set({ loading: true });
        try {
            const response = await getUsers(page, limit);
            set({ 
                users: response?.data || [],
                loading: false 
            });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al cargar usuarios");
            throw error;
        }
    },

    createUser: async (userData) => {
        set({ loading: true });
        try {
            const response = await createUser(userData);
            toast.success("Usuario creado exitosamente");
            await get().fetchUsers();
            set({ loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al crear usuario");
            throw error;
        }
    },

    updateUser: async (id, userData) => {
        set({ loading: true });
        try {
            const response = await updateUser(id, userData);
            toast.success("Usuario actualizado exitosamente");
            await get().fetchUsers();
            set({ loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al actualizar usuario");
            throw error;
        }
    },

    changeUserStatus: async (id) => {
        set({ loading: true });
        try {
            const response = await changeUserStatus(id);
            toast.success("Estado del usuario actualizado");
            await get().fetchUsers();
            set({ loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al cambiar estado");
            throw error;
        }
    },

    setCurrentUser: (user) => {
        set({ currentUser: user });
    },
}));
