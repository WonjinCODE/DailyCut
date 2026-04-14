package com.dailycut.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_preferences")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "preference_id")
    private Long preferenceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ACTION, COMEDY, ROMANCE, THRILLER, SF, FANTASY, CRIME, DOCUMENTARY, ANIMATION
    @Column(name = "genre_code", nullable = false, length = 30)
    private String genreCode;

    @Column(nullable = false)
    private int priority;
}