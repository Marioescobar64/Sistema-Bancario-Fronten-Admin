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

export const changeUserStatus = async (id, isActive) => {
    const { data } = await axiosAdmin.put(`/users/${id}/status`, { isActive });
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

export const changeAccountStatus = async (id, isActive) => {
    const { data } = await axiosAdmin.put(`/accounts/${id}/status`, { isActive });
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
    const { data } = await axiosAdmin.post("/cards", cardData);
    return data;
};

export const updateCard = async (id, cardData) => {
    const { data } = await axiosAdmin.put(`/cards/${id}`, cardData);
    return data;
};

export const changeCardStatus = async (id, isActive) => {
    const { data } = await axiosAdmin.put(`/cards/${id}/status`, { isActive });
    return data;
};

// ================= TRANSFERS =================
export const getTransfers = async (page = 1, limit = 10, account = null) => {
    const { data } = await axiosAdmin.get("/transfers", {
        params: { page, limit, ...(account && { account }) }
    });
    return data;
};

export const getTransferById = async (id) => {
    const { data } = await axiosAdmin.get(`/transfers/${id}`);
    return data;
};

export const createTransfer = async (transferData) => {
    const { data } = await axiosAdmin.post("/transfers", transferData);
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

export const changeLoanStatus = async (id, isActive) => {
    const { data } = await axiosAdmin.put(`/loans/${id}/status`, { isActive });
    return data;
};

// ================= AUDIT LOGS =================
export const getAuditLogs = async (page = 1, limit = 10, entity = null, action = null) => {
    const { data } = await axiosAdmin.get("/audit-logs", {
        params: { page, limit, ...(entity && { entity }), ...(action && { action }) }
    });
    return data;
};

export const getAuditLogById = async (id) => {
    const { data } = await axiosAdmin.get(`/audit-logs/${id}`);
    return data;
};

// ================= SUSPICIOUS MOVEMENTS =================
export const getSuspiciousMovements = async (page = 1, limit = 10, status = null) => {
    const { data } = await axiosAdmin.get("/suspicious-movements", {
        params: { page, limit, ...(status && { status }) }
    });
    return data;
};

export const getSuspiciousMovementById = async (id) => {
    const { data } = await axiosAdmin.get(`/suspicious-movements/${id}`);
    return data;
};

export const updateSuspiciousMovementStatus = async (id, status) => {
    const { data } = await axiosAdmin.put(`/suspicious-movements/${id}`, { status });
    return data;
};
