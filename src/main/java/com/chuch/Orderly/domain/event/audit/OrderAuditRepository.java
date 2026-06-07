package com.chuch.Orderly.domain.event.audit;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderAuditRepository extends JpaRepository<OrderAuditEvent, UUID> {
}
