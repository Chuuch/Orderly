import type { CreateTableRequest, TableResponse, UpdateTableRequest } from "@/types/restaurant";
import { apiClient } from "./client";

export const tablesApi = {
    getRestaurantTables: (restaurantId: string) => 
        apiClient.get<TableResponse[]>(`/api/v1/restaurants/${restaurantId}/tables`)
    .then((r) => r.data),

    createTable: (restaurantId: string, body: CreateTableRequest) =>
        apiClient.post<TableResponse>(`/api/v1/restaurants/${restaurantId}/tables`, body)
    .then((r) => r.data),

    updateTable: (restaurantId: string, tableId: string, body: UpdateTableRequest) =>
        apiClient
            .put<TableResponse>(`/api/v1/restaurants/${restaurantId}/tables/${tableId}`, body)
            .then((r) => r.data),
    
    deleteTable: (restaurantId: string, tableId: string) =>
        apiClient
            .delete(`/api/v1/restaurants/${restaurantId}/tables/${tableId}`)
            .then(() => undefined),
}