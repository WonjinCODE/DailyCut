package com.dailycut.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "session_recommendations")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_rec_id")
    private Long sessionRecId;

    @Column(name = "session_id", nullable = false, unique = true, length = 100)
    private String sessionId;

    @Column(name = "input_time_min", nullable = false)
    private Integer inputTimeMin;

    // 쉼표 구분 장르 ID 문자열 (예: "35,28")
    @Column(name = "selected_genres", length = 200)
    private String selectedGenres;

    // 추천된 콘텐츠 ID 목록 (예: "12345,67890,11111")
    @Column(name = "result_content_ids", length = 500)
    private String resultContentIds;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // TTL 만료 시간 — 배치 작업으로 삭제
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        // 기본 TTL: 24시간
        if (expiresAt == null) {
            expiresAt = createdAt.plusHours(24);
        }
    }
}