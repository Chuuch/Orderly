import { publicApi } from "@/api/public.api";
import { useQuery } from "@tanstack/react-query";

export function useQrContext(qrToken: string | undefined) {
    return useQuery({
        queryKey: ['qr-context', qrToken],
        queryFn: () => publicApi.getQrContext(qrToken!),
        enabled: Boolean(qrToken),
    });
}