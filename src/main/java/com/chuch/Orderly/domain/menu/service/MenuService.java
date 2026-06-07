package com.chuch.Orderly.domain.menu.service;

import com.chuch.Orderly.domain.menu.dto.CreateMenuItemRequest;
import com.chuch.Orderly.domain.menu.dto.MenuItemResponse;
import com.chuch.Orderly.domain.menu.dto.MenuResponse;
import com.chuch.Orderly.domain.menu.entity.Menu;
import com.chuch.Orderly.domain.menu.entity.MenuItem;
import com.chuch.Orderly.domain.menu.mapper.MenuMapper;
import com.chuch.Orderly.domain.menu.repository.MenuItemRepository;
import com.chuch.Orderly.domain.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MenuService {

    private final MenuRepository menuRepository;
    private final MenuItemRepository menuItemRepository;
    private final MenuMapper menuMapper;

    /**
     * Create a new menu for a restaurant
     * @param restaurantId - restaurant id we create a menu for
     * @param menuName - name of the menu
     * @param description - description of the menu
     */
    public MenuResponse createMenu(UUID restaurantId, String menuName, String description) {
        Menu menu = Menu.builder()
                .restaurantId(restaurantId)
                .name(menuName)
                .description(description)
                .isActive(true)
                .build();
        Menu savedMenu = menuRepository.save(menu);
        log.info("Created menu '{}' for restaurant {}", menuName, restaurantId);
        return menuMapper.toResponse(savedMenu);
    }

    public MenuItemResponse addMenuItem(UUID menuId, CreateMenuItemRequest request) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("Menu not found: " + menuId));

        MenuItem menuItem = MenuItem.builder()
                .menu(menu)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .preparationTimeMinutes(request.getPreparationTimeMinutes())
                .isAvalable(true)
                .isVegetarian(request.getIsVegetarian() != null ? request.getIsVegetarian() : false)
                .isSpicy(request.getIsSpicy() != null ? request.getIsSpicy() : false)
                .allergens(request.getAllergens())
                .imageUrl(request.getImageUrl())
                .build();
        MenuItem savedItem = menuItemRepository.save(menuItem);
        log.info("Added menu item '{}' to menu {}", request.getName(), menuId);
        return menuMapper.toMenuItemResponse(savedItem);
    }

    @Transactional(readOnly = true)
    public List<MenuResponse> getRestaurantMenus(UUID restaurantId) {
        List<Menu> menus = menuRepository.findByRestaurantIdAndIsActiveTrue(restaurantId);
        return menus.stream()
                .map(menuMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MenuResponse getMenu(UUID menuId) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("Menu not found: " + menuId));
        return menuMapper.toResponse(menu);
    }

    @Transactional(readOnly = true)
    public List<MenuItemResponse> getAvailableItems(UUID menuId) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found: " + menuId));

        return menu.getItems().stream()
                .filter(MenuItem::getIsAvalable)
                .map(menuMapper::toMenuItemResponse)
                .collect(Collectors.toList());
    }

    public MenuItemResponse updateMenuItem(UUID itemId, CreateMenuItemRequest request) {
        MenuItem item = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found: " + itemId));

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setPreparationTimeMinutes(request.getPreparationTimeMinutes());
        item.setIsVegetarian(request.getIsVegetarian() != null ? request.getIsVegetarian() : false);
        item.setIsSpicy(request.getIsSpicy() != null ? request.getIsSpicy() : false);
        item.setAllergens(request.getAllergens());

        MenuItem updatedItem = menuItemRepository.save(item);
        log.info("Updated menu item {}", itemId);
        return menuMapper.toMenuItemResponse(updatedItem);
    }

    public MenuItemResponse toggleMenuItemAvailability(UUID itemId) {
        MenuItem item = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found: " + itemId));
        item.setIsAvalable(!item.getIsAvalable());
        MenuItem updatedItem = menuItemRepository.save(item);
        log.info("Toggled availability for menu item {}: now {}", itemId, item.getIsAvalable());
        return menuMapper.toMenuItemResponse(updatedItem);
    }

    public void deleteMenuItem(UUID itemId) {
        if (!menuItemRepository.existsById(itemId)) {
            throw new IllegalArgumentException("Menu item not found: " + itemId);
        }
        menuItemRepository.deleteById(itemId);
        log.info("Deleted menu item {}", itemId);
    }

    public void deactivateMenu(UUID menuId) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("Menu not found: " + menuId));
        menu.setIsActive(false);
        menuRepository.save(menu);
        log.info("Deactivated menu {}", menuId);
    }
}
