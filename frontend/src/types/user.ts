export type UserResponse = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    restaurantId: string;
    isActive: boolean;
    roles: string[];
    createdAt: string;
    lastLogin?: string;
}