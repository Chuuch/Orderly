import { authApi } from "@/api/auth.api";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import type { AuthResponse, LoginRequest } from "@/types/auth";
import type { ApiErrorResponse } from "@/types/api-error";

export function useLogin() {
    const { setSession } = useAuth();

    return useMutation<AuthResponse, ApiErrorResponse, LoginRequest>({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            setSession(data);
        }
    })
}