package com.chuch.Orderly.domain.user.enums;

public enum RoleType {
    RESTAURANT_ADMIN("Full access to restaurant management"),
    KITCHEN_STAFF("Access to kitchen display system"),
    WAITER("Can manage orders and customer requests"),
    CUSTOMER("Can place orders as guest");

    private final String description;

    RoleType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
