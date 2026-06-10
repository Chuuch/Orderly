import type { QrScanContext } from "@/types/restaurant";
import { apiClient } from "./client";

export const publicApi = {
    getQrContext: (qrToken: string) =>
        apiClient
            .get<QrScanContext>(`/api/v1/public/tables/qr/${qrToken}/context`)
            .then((r) => r.data),
}