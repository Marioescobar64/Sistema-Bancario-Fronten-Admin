import { axiosAdmin } from "./api";

// ================= USERS =================
export const getUsers = async (page = 1, limit = 10, isActive = true) => {
    const { data } = await axiosAdmin.get("/users", {
        params: { page, limit, isActive }
    });
    return data;
};

export const getUserById = async (id) => {
    const { data } = await axiosAdmin.get(`/users/${id}`);
    return data;
};

export const createUser = async (userData) => {
    const { data } = await axiosAdmin.post("/users", userData);
    return data;
};

export const updateUser = async (id, userData) => {
    const { data } = await axiosAdmin.put(`/users/${id}`, userData);
    return data;
};

export const changeUserStatus = async (id) => {
    const { data } = await axiosAdmin.patch(`/users/status/${id}`);
    return data;
};

// ================= ACCOUNTS =================
export const getAccounts = async (page = 1, limit = 10) => {
    const { data } = await axiosAdmin.get("/accounts", {
        params: { page, limit }
    });
    return data;
};

export const getAccountById = async (id) => {
    const { data } = await axiosAdmin.get(`/accounts/${id}`);
    return data;
};

export const createAccount = async (accountData) => {
    const { data } = await axiosAdmin.post("/accounts", accountData);
    return data;
};

export const updateAccount = async (id, accountData) => {
    const { data } = await axiosAdmin.put(`/accounts/${id}`, accountData);
    return data;
};

export const changeAccountStatus = async (id) => {
    const { data } = await axiosAdmin.patch(`/accounts/status/${id}`);
    return data;
};

// ================= CARDS =================
export const getCards = async (page = 1, limit = 10, isActive = true) => {
    const { data } = await axiosAdmin.get("/cards", {
        params: { page, limit, isActive }
    });
    return data;
};

export const getCardById = async (id) => {
    const { data } = await axiosAdmin.get(`/cards/${id}`);
    return data;
};

export const createCard = async (cardData) => {
    // Si es FormData (con imagen), dejar que axios establezca el Content-Type
    if (cardData instanceof FormData) {
        const { data } = await axiosAdmin.post("/cards", cardData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    }
    const { data } = await axiosAdmin.post("/cards", cardData);
    return data;
};

export const updateCard = async (id, cardData) => {
    if (cardData instanceof FormData) {
        const { data } = await axiosAdmin.put(`/cards/${id}`, cardData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    }
    const { data } = await axiosAdmin.put(`/cards/${id}`, cardData);
    return data;
};

export const changeCardStatus = async (id, isActive) => {
    // El backend expone endpoints separados para activar/desactivar
    if (isActive) {
        const { data } = await axiosAdmin.put(`/cards/${id}/activate`);
        return data;
    } else {
        const { data } = await axiosAdmin.put(`/cards/${id}/deactivate`);
        return data;
    }
};

// ================= TRANSFERS =================
export const getTransfers = async (page = 1, limit = 10, account = null) => {
    const { data } = await axiosAdmin.get("/transfers", {
        params: { page, limit, ...(account && { account }) }
    });
    return data;
};

// NOTE: backend actualmente no expone GET /transfers/:id — usar getTransfers con filtros.

export const createTransfer = async (transferData) => {
    const { data } = await axiosAdmin.post("/transfers", transferData);
    return data;
};

// ================= ACCOUNTS - Money Ops =================
export const depositMoney = async (accountNumber, amount) => {
    const { data } = await axiosAdmin.patch(`/accounts/deposit/${accountNumber}`, { amount });
    return data;
};

export const withdrawMoney = async (accountNumber, amount) => {
    const { data } = await axiosAdmin.patch(`/accounts/withdraw/${accountNumber}`, { amount });
    return data;
};

// ================= LOANS =================
export const getLoans = async (page = 1, limit = 10, isActive = true) => {
    const { data } = await axiosAdmin.get("/loans", {
        params: { page, limit, isActive }
    });
    return data;
};

export const getLoanById = async (id) => {
    const { data } = await axiosAdmin.get(`/loans/${id}`);
    return data;
};

export const createLoan = async (loanData) => {
    const { data } = await axiosAdmin.post("/loans", loanData);
    return data;
};

export const updateLoan = async (id, loanData) => {
    const { data } = await axiosAdmin.put(`/loans/${id}`, loanData);
    return data;
};

export const changeLoanStatus = async (id, status) => {
    const { data } = await axiosAdmin.patch(`/loans/status/${id}`, { status });
    return data;
};

// ================= AUDIT LOGS =================
export const getAuditLogs = async (page = 1, limit = 10, entity = null, action = null) => {
    const { data } = await axiosAdmin.get("/auditLogs", {
        params: { page, limit, ...(entity && { entity }), ...(action && { action }) }
    });
    return data;
};

export const getAuditLogById = async (id) => {
    const { data } = await axiosAdmin.get(`/auditLogs/${id}`);
    return data;
};

// ================= SUSPICIOUS MOVEMENTS =================
export const getSuspiciousMovements = async (page = 1, limit = 10, status = null) => {
    const { data } = await axiosAdmin.get("/suspicious", {
        params: { page, limit, ...(status !== null && { revisada: status }) }
    });
    return data;
};

export const getSuspiciousMovementById = async (id) => {
    const { data } = await axiosAdmin.get(`/suspicious/${id}`);
    return data;
};

export const updateSuspiciousMovementStatus = async (id, reviewed) => {
    const endpoint = reviewed ? `/suspicious/${id}/review` : `/suspicious/${id}/unreview`;
    const { data } = await axiosAdmin.put(endpoint);
    return data;
};
