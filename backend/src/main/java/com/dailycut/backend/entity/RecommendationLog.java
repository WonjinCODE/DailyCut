package com.dailycut.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendation_logs")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "input_time_min", nullable = false)
    private Integer inputTimeMin;

    // 쉼표 구분 장르 ID 문자열 (예: "35,28")
    @Column(name = "selected_genres", length = 200)
    private String selectedGenres;

    @Column(name = "selected_ott", length = 200)
    private String selectedOtt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recommended_content_id", nullable = false)
    private Content recommendedContent;

    @Column(name = "time_fit_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal timeFitScore;

    @Column(name = "genre_fit_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal genreFitScore;

    @Column(name = "popularity_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal popularityScore;

    @Column(name = "total_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal totalScore;

    // 0: 미선택, 1: 선택(봤어요/볼거예요), -1: 별로예요
    @Column(name = "is_selected", nullable = false)
    private int isSelected;

    @Column(name = "recommended_at", nullable = false, updatable = false)
    private LocalDateTime recommendedAt;

    @PrePersist
    protected void onCreate() {
        recommendedAt = LocalDateTime.now();
    }
}