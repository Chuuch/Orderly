package com.chuch.Orderly.domain.restaurant.service;

import com.chuch.Orderly.domain.menu.dto.MenuResponse;
import com.chuch.Orderly.domain.menu.entity.MenuItem;
import com.chuch.Orderly.domain.menu.repository.MenuItemRepository;
import com.chuch.Orderly.domain.menu.service.MenuService;
import com.chuch.Orderly.domain.order.dto.CreateOrderRequest;
import com.chuch.Orderly.domain.order.dto.OrderItemRequest;
import com.chuch.Orderly.domain.order.dto.OrderResponse;
import com.chuch.Orderly.domain.order.service.OrderService;
import com.chuch.Orderly.domain.restaurant.dto.PublicCreateOrderRequest;
import com.chuch.Orderly.domain.restaurant.dto.QrScanContextResponse;
import com.chuch.Orderly.domain.restaurant.dto.TableResponse;
import com.chuch.Orderly.domain.restaurant.entity.Restaurant;
import com.chuch.Orderly.domain.restaurant.mapper.RestaurantMapper;
import com.chuch.Orderly.domain.user.entity.Role;
import com.chuch.Orderly.domain.user.entity.User;
import com.chuch.Orderly.domain.user.enums.RoleType;
import com.chuch.Orderly.domain.user.repository.RoleRepository;
import com.chuch.Orderly.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PublicCustomerService {

    private static final String GUEST_EMAIL = "qr-guest@orderly.internal";

    private final TableService tableService;
    private final MenuService menuService;
    private final RestaurantService restaurantService;
    private final RestaurantMapper restaurantMapper;
    private final OrderService orderService;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public QrScanContextResponse getQrScanContext(UUID qrCodeToken) {
        TableResponse table = tableService.getTableByQrToken(qrCodeToken);
        Restaurant restaurant = restaurantService.getRestaurant(table.getRestaurantId());
        List<MenuResponse> menus = menuService.getRestaurantMenus(table.getRestaurantId());

        return QrScanContextResponse.builder()
                .table(table)
                .restaurant(restaurantMapper.toResponse(restaurant))
                .menus(menus)
                .build();
    }

    @Transactional
    public OrderResponse createOrderFromQr(UUID qrCodeToken, PublicCreateOrderRequest request) {
        log.info("Creating public order for QR token {} with {} items", qrCodeToken, request.getItems().size());
        TableResponse table = tableService.getTableByQrToken(qrCodeToken);
        UUID restaurantId = table.getRestaurantId();

        validateMenuItems(restaurantId, request.getItems());

        UUID guestUserId = resolveGuestUserId(restaurantId);

        CreateOrderRequest createOrderRequest = CreateOrderRequest.builder()
                .restaurantId(restaurantId)
                .restaurantTableId(table.getId())
                .items(request.getItems())
                .specialInstructions(request.getSpecialInstructions())
                .build();

        OrderResponse response = orderService.createOrder(createOrderRequest, guestUserId);
        log.info("Public order {} created for table {}", response.getId(), table.getId());
        return response;
    }

    private void validateMenuItems(UUID restaurantId, List<OrderItemRequest> items) {
        for (OrderItemRequest itemRequest : items) {
            MenuItem menuitem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new IllegalArgumentException("Menu item not found: " + itemRequest.getMenuItemId()));

            if (!restaurantId.equals(menuitem.getMenu().getRestaurantId())) {
                throw new IllegalArgumentException("Menu item does not belong to this restaurant: " + itemRequest.getMenuItemId());
            }

            Boolean available = menuitem.getIsAvalable();
            if (available != null && !available) {
                throw new IllegalArgumentException("Menu item s not available: " + menuitem.getName());
            }
        }
    }

    private UUID resolveGuestUserId(UUID restaurantId) {
        return userRepository.findByEmailAndRestaurantId(GUEST_EMAIL, restaurantId)
                .map(User::getId)
                .orElseGet(() -> createGuestUser(restaurantId));
    }

    private UUID createGuestUser(UUID restaurantId) {
        Role customerRole = roleRepository.findByRoleType(RoleType.CUSTOMER)
                .orElseThrow(() -> new IllegalStateException("CUSTOMER role not found"));

        User guest = User.builder()
                .firstName("QR")
                .lastName("Guest")
                .email(GUEST_EMAIL)
                .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                .restaurantId(restaurantId)
                .isActive(true)
                .roles(new HashSet<>(Set.of(customerRole)))
                .build();

        User savedUser = userRepository.save(guest);
        log.info("Created QR gues user {} for restaurant {}", savedUser.getId(), restaurantId);
        return savedUser.getId();
    }
}
