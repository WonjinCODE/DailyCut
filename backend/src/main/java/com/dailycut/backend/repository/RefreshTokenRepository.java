package com.dailycut.backend.repository;

import com.dailycut.backend.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByTokenValue(String tokenValue);
    void deleteByUser_UserId(Long userId);
}