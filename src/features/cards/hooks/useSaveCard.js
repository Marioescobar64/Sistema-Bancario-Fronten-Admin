import { useState } from "react";
import { useCardStore } from "../store/cardStore";

export const useSaveCard = () => {
    const [loading, setLoading] = useState(false);
    const { createCard, updateCard } = useCardStore();

    const save = async (cardData, isEdit = false) => {
        setLoading(true);
        try {
            if (isEdit) {
                await updateCard(cardData.id, cardData);
            } else {
                await createCard(cardData);
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
