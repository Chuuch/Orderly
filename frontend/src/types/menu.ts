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