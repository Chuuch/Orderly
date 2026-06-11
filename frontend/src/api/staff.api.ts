import type { UserResponse } from "@/types/user";
import type { InviteStaffRequest, UpdateUserRolesRequest } from "@/types/staff";
import { apiClient } from "./client";

export const staffApi = {
    list: () => apiClient.get<UserResponse[]>("/api/v1/users").then((r) => r.data),

    invite: (body: InviteStaffRequest) =>
        apiClient.post<UserResponse>("/api/v1/users", body).then((r) => r.data),

    updateRoles: (userId: string, body: UpdateUserRolesRequest) =>
        apiClient.put<UserResponse>(`/api/v1/users/${userId}/roles`, body).then((r) => r.data),

    deactivate: (userId: string) =>
        apiClient.delete<void>(`/api/v1/users/${userId}`).then((r) => r.data),
};