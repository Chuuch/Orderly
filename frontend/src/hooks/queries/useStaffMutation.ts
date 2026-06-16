import { staffApi } from "@/api/staff.api";
import type { ApiErrorResponse } from "@/types/api-error";
import type { InviteStaffRequest, UpdateUserRolesRequest } from "@/types/staff";
import type { UserResponse } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useStaffMutation() {
    const queryClient = useQueryClient();

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: ["restaurant-staff"] });

    const invite = useMutation<UserResponse, ApiErrorResponse, InviteStaffRequest>({
        mutationFn: staffApi.invite,
        onSuccess: invalidate,
    });

    const updateRoles = useMutation<
        UserResponse,
        ApiErrorResponse,
        { userId: string; body: UpdateUserRolesRequest }
    >({
        mutationFn: ({ userId, body }) => staffApi.updateRoles(userId, body),
        onSuccess: invalidate,
    });

    const deactivate = useMutation<void, ApiErrorResponse, string>({
        mutationFn: staffApi.deactivate,
        onSuccess: invalidate,
    });

    return { invite, updateRoles, deactivate };
}