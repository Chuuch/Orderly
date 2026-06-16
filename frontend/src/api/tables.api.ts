import type { CreateTableRequest, TableResponse } from "@/types/restaurant";
import { apiClient } from "./client";

export const tablesApi = {
    getRestaurantTables: (restaurantId: string) => 
        apiClient.get<TableResponse[]>(`/api/v1/restaurants/${restaurantId}/tables`)
    .then((r) => r.data),

    createTable: (restaurantId: string, body: CreateTableRequest) =>
        apiClient.post<TableResponse>(`/api/v1/restaurants/${restaurantId}/tables`, body)
    .then((r) => r.data),
}