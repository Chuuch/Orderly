import type { KitchenWebSocketMessage } from "@/types/kitchen";
import { Client } from "@stomp/stompjs";

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:8080/ws";

export function subscribeKitchenTopic(
    restaurantId: string,
    onMessage: (message: KitchenWebSocketMessage) => void,
    onConnectionChange: (connected: boolean) => void,
): Client {
    const client = new Client({
        brokerURL: WS_URL,
        reconnectDelay: 3000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        onConnect: () => {
            onConnectionChange?.(true);
            client.subscribe(`/topic/restaurant/${restaurantId}/kitchen`, (frame) => {
                const message = JSON.parse(frame.body) as KitchenWebSocketMessage;
                onMessage(message);
            });
        },
        onDisconnect: () => onConnectionChange?.(false),
        onStompError: () => onConnectionChange?.(false),
        onWebSocketClose: () => onConnectionChange?.(false),
    });
    return client;
}