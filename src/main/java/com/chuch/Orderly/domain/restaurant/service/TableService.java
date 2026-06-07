package com.chuch.Orderly.domain.restaurant.service;

import com.chuch.Orderly.domain.restaurant.dto.CreateTableRequest;
import com.chuch.Orderly.domain.restaurant.dto.TableResponse;
import com.chuch.Orderly.domain.restaurant.entity.Restaurant;
import com.chuch.Orderly.domain.restaurant.entity.RestaurantTable;
import com.chuch.Orderly.domain.restaurant.mapper.TableMapper;
import com.chuch.Orderly.domain.restaurant.repository.RestaurantRepository;
import com.chuch.Orderly.domain.restaurant.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TableService {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantTableRepository tableRepository;
    private final TableMapper tableMapper;

    public TableResponse createTable(UUID restaurantId, CreateTableRequest request) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found: " + restaurantId));

        RestaurantTable table = tableMapper.toEntity(request, restaurant);
        RestaurantTable saved = tableRepository.save(table);

        log.info("Created table {} for restaurant {}", saved.getTableNumber(), restaurantId);
        return tableMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<TableResponse> getRestaurantTables(UUID restaurantId) {
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new IllegalArgumentException("Restaurant not found: " + restaurantId);
        }
        return tableRepository.findByRestaurant_Id(restaurantId).stream()
                .map(tableMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TableResponse getTableByQrToken(UUID qrCodeToken) {
        RestaurantTable table = tableRepository.findByQrCodeToken(qrCodeToken)
                .orElseThrow(() -> new IllegalArgumentException("Table not found for QR token"));
        return tableMapper.toResponse(table);
    }
}
