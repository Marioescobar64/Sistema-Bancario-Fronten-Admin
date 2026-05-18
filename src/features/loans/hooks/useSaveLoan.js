import { useState } from "react";
import { useLoanStore } from "../store/loanStore";

export const useSaveLoan = () => {
    const [loading, setLoading] = useState(false);
    const { createLoan, updateLoan } = useLoanStore();

    const save = async (loanData, isEdit = false) => {
        setLoading(true);
        try {
            if (isEdit) {
                await updateLoan(loanData.id, loanData);
            } else {
                await createLoan(loanData);
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
