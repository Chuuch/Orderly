import type { UserResponse } from "@/types/user";
import { apiClient } from "./client";

export const userApi = {
    getMe: () => apiClient.get<UserResponse>("/api/v1/users/me").then((r) => r.data)
}