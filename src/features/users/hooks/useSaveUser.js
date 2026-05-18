import { useState } from "react";
import { useUserStore } from "../store/userStore";

export const useSaveUser = () => {
    const [loading, setLoading] = useState(false);
    const { createUser, updateUser } = useUserStore();

    const save = async (userData, isEdit = false) => {
        setLoading(true);
        try {
            if (isEdit) {
                await updateUser(userData.id, userData);
            } else {
                await createUser(userData);
            }
            setLoading(false);
            return { success: true };
        } catch (error) {
            setLoading(false);
            return { success: false, error };
        }
    };

    return { save, loading };
};
