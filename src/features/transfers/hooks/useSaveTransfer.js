import { useState } from "react";
import { useTransferStore } from "../store/transferStore";

export const useSaveTransfer = () => {
    const [loading, setLoading] = useState(false);
    const { createTransfer } = useTransferStore();

    const save = async (transferData) => {
        setLoading(true);
        try {
            await createTransfer(transferData);
            setLoading(false);
            return { success: true };
        } catch (error) {
            setLoading(false);
            return { success: false, error };
        }
    };

    return { save, loading };
};
