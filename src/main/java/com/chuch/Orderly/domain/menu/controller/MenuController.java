package com.chuch.Orderly.domain.menu.controller;

import com.chuch.Orderly.domain.menu.dto.CreateMenuItemRequest;
import com.chuch.Orderly.domain.menu.dto.MenuItemResponse;
import com.chuch.Orderly.domain.menu.dto.MenuResponse;
import com.chuch.Orderly.domain.menu.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    /**
     * Create a new menu
     * @param restaurantId - the restaurant id we search by
     * @param menuName - name for the menu
     * @param description - description for the menu
     * @return - returns a MenuResponse
     */
    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<MenuResponse> createMenu(
            @RequestParam UUID restaurantId,
            @RequestParam String menuName,
            @RequestParam(required = false) String description
            ) {
        MenuResponse response = menuService.createMenu(restaurantId, menuName, description);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all menus for a restaurant
     * @param restaurantId - the id of the restaurant we search by
     * @return - returns a list of items of type MenuRespponse
     */
    @GetMapping("/restaurant/{restaurantId}")
    @PreAuthorize("hasAnyRole('RESTAURANT_ADMIN', 'KITCHEN_STAFF', 'WAITER', 'CUSTOMER')")
    public ResponseEntity<List<MenuResponse>> getRestaurantMenus(@PathVariable UUID restaurantId) {
        List<MenuResponse> menus = menuService.getRestaurantMenus(restaurantId);
        return ResponseEntity.ok(menus);
    }


    /**
     * Get a specific menu by id
     * @param menuId - id of the menu we search by
     * @return - returns a MenuResponse
     */
    @GetMapping("/{menuId}")
    @PreAuthorize("hasAnyRole('RESTAURANT_ADMIN', 'KITCHEN_STAFF', 'WAITER', 'CUSTOMER')")
    public ResponseEntity<MenuResponse> getMenu(@PathVariable UUID menuId) {
        MenuResponse menu = menuService.getMenu(menuId);
        return ResponseEntity.ok(menu);
    }


    /**
     * Get available items from menu by id
     * @param menuId - id of the menu we search by
     * @return - returns a list of MenuItemResponse items
     */
    @GetMapping("/{menuId}/available-items")
    @PreAuthorize("hasAnyRole('RESTAURANT_ADMIN', 'KITCHEN_STAFF', 'WAITER', 'CUSTOMER')")
    public ResponseEntity<List<MenuItemResponse>> getAvailableItems(@PathVariable UUID menuId) {
        List<MenuItemResponse> items = menuService.getAvailableItems(menuId);
        return ResponseEntity.ok(items);
    }


    /**
     * Add a menu item
     * @param menuId - id of the menu we add item to
     * @param request - the form of the object we are adding
     * @return - returns a MenuItemResponse object
     */
    @PostMapping("/{menuId}/items")
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<MenuItemResponse> addMenuItem(
            @PathVariable UUID menuId,
            @Valid @RequestBody CreateMenuItemRequest request
            ) {
        MenuItemResponse response = menuService.addMenuItem(menuId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    /**
     * Update a menu ite
     * @param itemId - id of the item we update
     * @param request - form of the dto
     * @return - returns a MenuItemResponse object
     */
    @PutMapping("/items/{itemId}")
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<MenuItemResponse> updateMenuItem(
            @PathVariable UUID itemId,
            @Valid @RequestBody CreateMenuItemRequest request
    ) {
        MenuItemResponse response = menuService.updateMenuItem(itemId, request);
        return ResponseEntity.ok(response);
    }


    /**
     * Toggle menu item availability
     * @param itemId - id of item we toggle availability for
     * @return - returns a MenuItemResponse object
     */
    @PatchMapping("/items/{itemId}/availability")
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<MenuItemResponse> toggleAvailability(@PathVariable UUID itemId) {
        MenuItemResponse response = menuService.toggleMenuItemAvailability(itemId);
        return ResponseEntity.ok(response);
    }


    /**
     * Delete an item from the menu
     * @param itemId - id of the item we delete
     * @return - returns void
     */
    @DeleteMapping("/items/{itemId}")
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable UUID itemId) {
        menuService.deleteMenuItem(itemId);
        return ResponseEntity.noContent().build();
    }


    /**
     * Deactivates a menu
     * @param menuId - id of the menu we deactivate
     * @return - returns void
     */
    @PatchMapping("/{menuId}/deactivate")
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<Void> deactivateMenu(@PathVariable UUID menuId) {
        menuService.deactivateMenu(menuId);
        return ResponseEntity.noContent().build();
    }
}
