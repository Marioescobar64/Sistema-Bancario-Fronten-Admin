import { axiosAuth } from './api';

export const login = async (data) => {
    return await axiosAuth.post('/auth/login', data);
};

export const register = async () => {
    return await axiosAuth.post('/auth/register', data, {
        Headers: {"Content-Type": "multipart/form-data"}
    });
};