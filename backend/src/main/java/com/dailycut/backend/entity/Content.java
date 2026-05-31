package com.dailycut.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contents")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id")
    private Long contentId;

    @Column(name = "tmdb_id", nullable = false, unique = true, length = 20)
    private String tmdbId;

    @Column(nullable = false, length = 200)
    private String title;

    // 쉼표 구분 장르 코드 문자열 (예: "28,878,53")
    @Column(name = "genre_codes", length = 200)
    private String genreCodes;

    @Column(name = "runtime_min")
    private Integer runtimeMin;

    // "movie" or "tv"
    @Column(name = "content_type", nullable = false, length = 20)
    private String contentType;

    // 쉼표 구분 OTT 코드 문자열 (예: "NETFLIX,TVING")
    @Column(name = "ott_codes", length = 200)
    private String ottCodes;

    @Column(columnDefinition = "TEXT")
    private String overview;

    @Column(name = "poster_url", length = 300)
    private String posterUrl;

    @Column(name = "tmdb_rating", nullable = false, precision = 3, scale = 1)
    private BigDecimal tmdbRating;

    @Column(name = "fetched_at", nullable = false)
    private LocalDateTime fetchedAt;

    @OneToMany(mappedBy = "recommendedContent", cascade = CascadeType.ALL)
    private List<RecommendationLog> recommendationLogs = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        fetchedAt = LocalDateTime.now();
    }
}