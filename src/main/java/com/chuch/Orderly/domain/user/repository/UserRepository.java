package com.chuch.Orderly.domain.user.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chuch.Orderly.domain.user.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean eistsByEmailAndRestaurantId(String email, UUID restaurantId);
    Optional<User> findByEmailAndRestaurantId(String email, UUID restaurantId);
}
