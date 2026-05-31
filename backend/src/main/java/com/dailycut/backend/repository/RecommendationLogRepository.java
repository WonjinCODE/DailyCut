package com.dailycut.backend.repository;

import com.dailycut.backend.entity.RecommendationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecommendationLogRepository extends JpaRepository<RecommendationLog, Long> {
    // 특정 유저의 최근 추천 이력 조회 (D(c) 다양성 점수 계산용)
    List<RecommendationLog> findTop10ByUser_UserIdOrderByRecommendedAtDesc(Long userId);
}