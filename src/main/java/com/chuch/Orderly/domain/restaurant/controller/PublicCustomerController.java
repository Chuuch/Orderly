package com.chuch.Orderly.domain.restaurant.controller;

import com.chuch.Orderly.domain.order.dto.OrderResponse;
import com.chuch.Orderly.domain.restaurant.dto.PublicCreateOrderRequest;
import com.chuch.Orderly.domain.restaurant.dto.QrScanContextResponse;
import com.chuch.Orderly.domain.restaurant.service.PublicCustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicCustomerController {

    private final PublicCustomerService publicCustomerService;

    @GetMapping("/tables/qr/{qrCodeToken}/context")
    public ResponseEntity<QrScanContextResponse> getQrScanContext(@PathVariable UUID qrCodeToken) {
        return ResponseEntity.ok(publicCustomerService.getQrScanContext(qrCodeToken));
    }

    @PostMapping("/tables/qr/{qrCodeToken}/orders")
    public ResponseEntity<OrderResponse> createOrderFromQr(
            @PathVariable UUID qrCodeToken,
            @Valid @RequestBody PublicCreateOrderRequest request
            ) {
        OrderResponse response = publicCustomerService.createOrderFromQr(qrCodeToken, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable UUID orderId) {
        return ResponseEntity.ok(publicCustomerService.getOrder(orderId));
    }
}
