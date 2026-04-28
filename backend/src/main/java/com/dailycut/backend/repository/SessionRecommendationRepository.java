package com.dailycut.backend.repository;

import com.dailycut.backend.entity.SessionRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

public interface SessionRecommendationRepository extends JpaRepository<SessionRecommendation, Long> {
    Optional<SessionRecommendation> findBySessionId(String sessionId);

    // TTL 만료된 세션 삭제 (배치용)
    @Modifying
    @Transactional
    @Query("DELETE FROM SessionRecommendation s WHERE s.expiresAt < :now")
    void deleteExpiredSessions(LocalDateTime now);
}