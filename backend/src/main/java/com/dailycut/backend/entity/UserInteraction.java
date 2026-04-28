package com.dailycut.backend.entity;

import com.dailycut.backend.domain.enums.InteractionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
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

    // 언제 눌렀는지
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
}