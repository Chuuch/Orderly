import type { MenuResponse } from "@/types/menu"
import { apiClient } from "./client"

export const menuApi = {
    getRestaurantMenus: (restaurantId: string) => {
        return apiClient
            .get<MenuResponse[]>(`/api/v1/menu/restaurant/${restaurantId}`)
            .then((r) => r.data);
    }
}