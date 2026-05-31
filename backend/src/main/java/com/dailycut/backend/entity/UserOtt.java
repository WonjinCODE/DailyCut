package com.dailycut.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_ott")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserOtt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_ott_id")
    private Long userOttId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // NETFLIX, TVING, WAVVE, DISNEY_PLUS, COUPANG_PLAY, WATCHA
    @Column(name = "ott_code", nullable = false, length = 30)
    private String ottCode;
}