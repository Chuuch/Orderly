export type StaffRole = "RESTAURANT_ADMIN" | "KITCHEN_STAFF" | "WAITER";

export type AuthResponse = {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    restaurantId: string;
    roles: string[];
    accessToken: string;
    expiresIn: number;
}

export type LoginRequest = {
    email: string;
    password: string;
}