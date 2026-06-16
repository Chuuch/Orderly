export type MenuItemResponse = {
    id: string;
    menuId: string;
    name: string;
    description?: string;
    price: number;
    preparationTimeMinutes?: number;
    isAvailable: boolean;
    isVegetarian: boolean;
    isSpicy: boolean;
    allergens?: string;
    imageUrl?: string;
    createdAt: string;
}

export type MenuResponse = {
    id: string;
    restaurantId: string;
    name: string;
    description?: string;
    isActive: boolean;
    items: MenuItemResponse[];
    createdAt: string;
    updatedAt: string;
}

export type CreateMenuItemRequest = {
    name: string;
    description?: string;
    price: number;
    preparationTimeMinutes: number;
    isVegetarian?: boolean;
    isSpicy?: boolean;
    allergens?: string;
    imageUrl?: string;
}

export type CreateMenuParams = {
    restaurantId: string;
    menuName: string;
    description?: string;
}