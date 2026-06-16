import type { AuthResponse, LoginRequest, OnboardingRequest } from "@/types/auth";
import { apiClient } from "./client";

export const authApi = {
    login: (body: LoginRequest) =>
        apiClient.post<AuthResponse>('/api/v1/auth/login', body).then((r) => r.data),
    onboard: (body: OnboardingRequest) =>
        apiClient.post<AuthResponse>('/api/v1/auth/onboard', body).then((r) => r.data)
}