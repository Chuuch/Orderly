import type { MenuResponse } from "./menu";

export type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED";

export type TableResponse = {
    id: string;
    restaurantId: string;
    tableNumber: string;
    qrCodeToken: string;
    status: TableStatus;
    createdat?: string;
}

export type CreateTableRequest = {
    tableNumber: string;
}

export type RestaurantResponse = {
    id: string;
    name: string;
    subdomain: string;
    address?: string;
    phoneNumber?: string;
    active: boolean;
}

export type QrScanContext = {
    table: TableResponse;
    restaurant: RestaurantResponse;
    menus: MenuResponse[];
}