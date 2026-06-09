package com.chuch.Orderly.domain.restaurant.service;

import com.chuch.Orderly.domain.menu.dto.MenuResponse;
import com.chuch.Orderly.domain.menu.service.MenuService;
import com.chuch.Orderly.domain.restaurant.dto.QrScanContextResponse;
import com.chuch.Orderly.domain.restaurant.dto.TableResponse;
import com.chuch.Orderly.domain.restaurant.entity.Restaurant;
import com.chuch.Orderly.domain.restaurant.mapper.RestaurantMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PublicCustomerService {

    private final TableService tableService;
    private final MenuService menuService;
    private final RestaurantService restaurantService;
    private final RestaurantMapper restaurantMapper;

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
}
