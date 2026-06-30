import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

import { login as loginRequest } from "../../shared/api";

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null,
            expiresAt: null,
            loading: false,
            error: null,
            isLoadingAuth: true,
            isAuthenticated: false,

            checkAuth: () => {
                const token = get().token;
                const role = get().user?.role;
                const isAdminPanelAllowed = ["SUPER_ADMIN_ROLE", "ADMIN_ROLE", "CAJERO_ROLE"].includes(role);

                if (token && !isAdminPanelAllowed) {
                    set({
                        user: null,
                        token: null,
                        refreshToken: null,
                        expiresAt: null,
                        isAuthenticated: false,
                        isLoadingAuth: false,
                        error: "No autorizado para acceder al panel de administración"
                    })
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    expiresAt: null,
                    isAuthenticated: false,
                })
            },

            login: async ({ emailOrUsername, password }) => {
                const { data } = await loginRequest({ emailOrUsername, password })

                // solo roles administrativos pueden iniciar sesion en sistema-bancario admin
                const role = data?.userDetails?.role;
                if (!["SUPER_ADMIN_ROLE", "ADMIN_ROLE", "CAJERO_ROLE"].includes(role)) {
                    const message = "No autorizado para acceder al panel de administración";
                    set({
                        user: null,
                        token: null,
                        refreshToken: null,
                        expiresAt: null,
                        isAuthenticated: false,
                        isLoadingAuth: false,
                        error: message,
                    });
                    toast.error(message);
                    return { success: false, error: message };
                }
                set({
                    user: data.userDetails,
                    token: data.accessToken || data.token,
                    refreshToken: data.refreshToken,
                    expiresAt: data.expiresIn || data.expiresAt,
                    isAuthenticated: true,
                    error: null,
                    isLoadingAuth: false,
                });
                return { success: true }
            },
        }),
        { name: "auth-store" })
);
