export type AuthResponse = {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    restaurantId: string;
    accessToken: string;
    expiresIn: number;
}

export type LoginRequest = {
    email: string;
    password: string;
}