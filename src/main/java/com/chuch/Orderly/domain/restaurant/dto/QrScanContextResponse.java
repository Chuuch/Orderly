package com.chuch.Orderly.domain.restaurant.dto;

import com.chuch.Orderly.domain.menu.dto.MenuResponse;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class QrScanContextResponse {
    private TableResponse table;
    private RestaurantResponse restaurant;
    private List<MenuResponse> menus;
}
