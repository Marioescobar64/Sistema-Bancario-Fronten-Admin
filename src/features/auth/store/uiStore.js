import { create } from "zustand";

export const useUIStore = create((set) => ({
    isDarkMode: localStorage.getItem("isDarkMode") === "true" || false,
    sidebarOpen: true,
    notifications: [],

    toggleDarkMode: () => {
        set((state) => {
            const newMode = !state.isDarkMode;
            localStorage.setItem("isDarkMode", newMode);
            return { isDarkMode: newMode };
        });
    },

    toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
    },

    addNotification: (notification) => {
        set((state) => ({
            notifications: [...state.notifications, notification]
        }));
    },

    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id)
        }));
    },
}));
