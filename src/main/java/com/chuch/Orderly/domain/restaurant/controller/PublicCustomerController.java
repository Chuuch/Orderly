package com.chuch.Orderly.domain.restaurant.controller;

import com.chuch.Orderly.domain.restaurant.dto.QrScanContextResponse;
import com.chuch.Orderly.domain.restaurant.service.PublicCustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
