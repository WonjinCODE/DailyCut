package com.dailycut.backend.entity;

import com.dailycut.backend.domain.enums.InteractionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "user_interactions")
public class UserInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 누가 눌렀는지 (유저 ID)
    @Column(nullable = false)
    private Long userId;

    // 어떤 영화에 눌렀는지 (영화 ID)
    @Column(nullable = false)
    private String contentId;

    // 어떤 버튼을 눌렀는지 (LIKE, WATCHED, DISLIKE)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InteractionType interactionType;

    @Column(name = "content_title", length = 200)
    private String contentTitle;

    @Column(name = "content_type", length = 20)
    private String contentType;

    @Column(name = "genre_ids", length = 200)
    private String genreIds;

    @Column(name = "poster_url", length = 300)
    private String posterUrl;

    @Column(name = "runtime_min")
    private Integer runtime;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public List<Integer> getParsedGenreIds() {
        if (genreIds == null || genreIds.isBlank()) {
            return Collections.emptyList();
        }

        return Arrays.stream(genreIds.split(","))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .map(Integer::parseInt)
                .collect(Collectors.toList());
    }
}
