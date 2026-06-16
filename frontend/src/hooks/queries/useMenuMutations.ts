import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import { type MenuResponse, type CreateMenuItemRequest, type CreateMenuParams, type MenuItemResponse } from "@/types/menu";
import type { ApiErrorResponse } from "@/types/api-error";
import { menuApi } from "@/api/menu.api";

export function useMenuMutations() {
    const { session } = useAuth();
    const restaurantId = session?.restaurantId;
    const queryClient = useQueryClient();

    const invalidate = () => {
        if (restaurantId) {
            queryClient.invalidateQueries({ queryKey: ["restaurant-menus", restaurantId] });
        }
    };

    const createMenu = useMutation<MenuResponse, ApiErrorResponse, Omit<CreateMenuParams, "restaurantId">>({
        mutationFn: (body) =>
            menuApi.createMenu({ restaurantId: restaurantId!, ...body }),
        onSuccess: invalidate,
    });

    const addMenuItem = useMutation<
        MenuItemResponse,
        ApiErrorResponse,
        { menuId: string; body: CreateMenuItemRequest }>({
            mutationFn: ({ menuId, body }) => menuApi.addMenuItem(menuId, body),
            onSuccess: invalidate,
        });

    const toggleAvailability = useMutation<MenuItemResponse, ApiErrorResponse, string>({
        mutationFn: menuApi.toggleItemAvailability,
        onSuccess: invalidate,
    });

    const updateMenuItem = useMutation<
        MenuItemResponse,
        ApiErrorResponse,
        { itemId: string; body: CreateMenuItemRequest }
    >({
        mutationFn: ({ itemId, body }) => menuApi.updateMenuItem(itemId, body),
        onSuccess: invalidate,
    });

    const deleteMenuItem = useMutation<void, ApiErrorResponse, string>({
        mutationFn: menuApi.deleteMenuItem,
        onSuccess: invalidate,
    });

    const deactivateMenu = useMutation<void, ApiErrorResponse, string>({
        mutationFn: menuApi.deactivateMenu,
        onSuccess: invalidate,
    });

    return { createMenu, addMenuItem, toggleAvailability, updateMenuItem, deleteMenuItem, deactivateMenu };

}