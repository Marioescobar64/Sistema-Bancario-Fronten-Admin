import { create } from "zustand";
import toast from "react-hot-toast";
import { 
    getAccounts, 
    createAccount, 
    updateAccount, 
    changeAccountStatus,
    depositMoney,
    withdrawMoney 
} from "../../../shared/api";

export const useAccountStore = create((set, get) => ({
    accounts: [],
    loading: false,
    currentAccount: null,

    fetchAccounts: async (page = 1, limit = 10) => {
        set({ loading: true });
        try {
            const response = await getAccounts(page, limit);
            set({ 
                accounts: response?.data || [],
                loading: false 
            });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al cargar cuentas");
            throw error;
        }
    },

    createAccount: async (accountData) => {
        set({ loading: true });
        try {
            const response = await createAccount(accountData);
            toast.success("Cuenta creada exitosamente");
            await get().fetchAccounts();
            set({ loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al crear cuenta");
            throw error;
        }
    },

    updateAccount: async (id, accountData) => {
        set({ loading: true });
        try {
            const response = await updateAccount(id, accountData);
            toast.success("Cuenta actualizada exitosamente");
            await get().fetchAccounts();
            set({ loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al actualizar cuenta");
            throw error;
        }
    },

    changeAccountStatus: async (id) => {
        set({ loading: true });
        try {
            const response = await changeAccountStatus(id);
            toast.success("Estado de la cuenta actualizado");
            await get().fetchAccounts();
            set({ loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al cambiar estado");
            throw error;
        }
    },

    depositMoney: async (accountNumber, amount) => {
        set({ loading: true });
        try {
            const response = await depositMoney(accountNumber, amount);
            toast.success("Depósito realizado exitosamente");
            await get().fetchAccounts();
            set({ loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al realizar depósito");
            throw error;
        }
    },

    withdrawMoney: async (accountNumber, amount) => {
        set({ loading: true });
        try {
            const response = await withdrawMoney(accountNumber, amount);
            toast.success("Retiro realizado exitosamente");
            await get().fetchAccounts();
            set({ loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            toast.error(error?.response?.data?.message || "Error al realizar retiro");
            throw error;
        }
    },

    setCurrentAccount: (account) => {
        set({ currentAccount: account });
    },
}));
