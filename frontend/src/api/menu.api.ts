import type { CreateMenuItemRequest, CreateMenuParams, MenuItemResponse, MenuResponse } from "@/types/menu"
import { apiClient } from "./client"

export const menuApi = {
    getRestaurantMenus: (restaurantId: string) =>
        apiClient
            .get<MenuResponse[]>(`/api/v1/menu/restaurant/${restaurantId}`)
            .then((r) => r.data),

    createMenu: ({ restaurantId, menuName, description }: CreateMenuParams) =>
        apiClient
            .post<MenuResponse>("/api/v1/menu", null, {
                params: { restaurantId, menuName, description },
            })
            .then((r) => r.data),
    addMenuItem: (menuId: string, body: CreateMenuItemRequest) =>
        apiClient
            .post<MenuItemResponse>(`/api/v1/menu/${menuId}/items`, body)
            .then((r) => r.data),
    toggleItemAvailability: (itemId: string) =>
        apiClient
            .patch<MenuItemResponse>(`/api/v1/menu/items/${itemId}/availability`)
            .then((r) => r.data),
    updateMenuItem: (itemId: string, body: CreateMenuItemRequest) =>
        apiClient.put<MenuItemResponse>(`/api/v1/menu/items/${itemId}`, body).then((r) => r.data),

    deleteMenuItem: (itemId: string) =>
        apiClient.delete(`/api/v1/menu/items/${itemId}`).then(() => undefined),

    deactivateMenu: (menuId: string) =>
        apiClient.patch(`/api/v1/menu/${menuId}/deactivate`).then(() => undefined),
}