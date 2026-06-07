package com.chuch.Orderly.domain.restaurant.controller;

import com.chuch.Orderly.domain.restaurant.dto.CreateTableRequest;
import com.chuch.Orderly.domain.restaurant.dto.TableResponse;
import com.chuch.Orderly.domain.restaurant.service.TableService;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    @PostMapping("/api/v1/restaurants/{restaurantId}/tables")
    @PreAuthorize("hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<TableResponse> createTable(
            @PathVariable UUID restaurantId,
            @Valid @RequestBody CreateTableRequest request
            ) {
        TableResponse response = tableService.createTable(restaurantId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/v1/restaurants/{restaurantId}/tables")
    @PreAuthorize("hasAnyRole('RESTAURANT_ADMIN', 'WAITER')")
    public ResponseEntity<List<TableResponse>> getRestaurantTables(@PathVariable UUID restaurantId) {
        return ResponseEntity.ok(tableService.getRestaurantTables(restaurantId));
    }

    @GetMapping("/api/v1/tables/qr/{qrCodeToken}")
    public ResponseEntity<TableResponse> getTableByQrToken(@PathVariable UUID qrCodeToken) {
        return ResponseEntity.ok(tableService.getTableByQrToken(qrCodeToken));
    }
}
