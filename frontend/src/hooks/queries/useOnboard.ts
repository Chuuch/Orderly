import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import type { AuthResponse, OnboardingRequest } from "@/types/auth";
import type { ApiErrorResponse } from "@/types/api-error";
import { authApi } from "@/api/auth.api";

export function useOnboard() {
    const { setSession } = useAuth();

    return useMutation<AuthResponse, ApiErrorResponse, OnboardingRequest>({
        mutationFn: authApi.onboard,
        onSuccess: setSession,
    });
}