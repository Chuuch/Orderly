import type { StaffRole } from "@/types/auth";

export const ASSIGNABLE_STAFF_ROLES: StaffRole[] = ["KITCHEN_STAFF", "WAITER"];
export const ALL_STAFF_ROLES: StaffRole[] = ["RESTAURANT_ADMIN", "KITCHEN_STAFF", "WAITER"];

export function hasRole(roles: string[] | undefined, role: StaffRole): boolean {
    return Boolean(roles?.includes(role));
}

export function isRestaurantAdmin(roles: string[] | undefined): boolean {
    return hasRole(roles, "RESTAURANT_ADMIN");
}

export function canAccessAdmin(roles: string[] | undefined): boolean {
    return isRestaurantAdmin(roles);
}

export function getDefaultRoute(roles: string[] | undefined): string {
    if (isRestaurantAdmin(roles)) return "/admin";
    if (hasRole(roles, "KITCHEN_STAFF") || hasRole(roles, "WAITER")) return "/kitchen";
    return "/admin";
}