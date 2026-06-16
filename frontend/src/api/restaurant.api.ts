import type { RestaurantResponse } from "@/types/restaurant";
import { apiClient } from "./client";

export type UpdateRestaurantRequest = {
    name: string;
    address?: string;
    phoneNumber?: string;
    isActive: boolean;
};

export const restaurantApi = {
    getRestaurant: (id: string) =>
        apiClient.get<RestaurantResponse>(`/api/v1/restaurants/${id}`).then((r) => r.data),

    updateRestaurant: (id: string, body: UpdateRestaurantRequest) =>
        apiClient.put<RestaurantResponse>(`/api/v1/restaurants/${id}`, body).then((r) => r.data),
};