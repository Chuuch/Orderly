import axios from "axios";
import { authStorage } from "@/lib/auth-storage";
import type { ApiErrorResponse } from "@/types/api-error";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
    const token = authStorage.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            authStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data as ApiErrorResponse)
    }
);