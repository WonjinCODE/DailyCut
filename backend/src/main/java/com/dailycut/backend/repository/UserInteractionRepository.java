package com.dailycut.backend.repository;

import com.dailycut.backend.entity.UserInteraction;
import com.dailycut.backend.domain.enums.InteractionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserInteractionRepository extends JpaRepository<UserInteraction, Long> {
    
    // 특정 유저가 특정 영화에 이미 버튼을 누른 적이 있는지 찾기
    Optional<UserInteraction> findByUserIdAndContentId(Long userId, String contentId);

    // 특정 유저가 '봤어요' 또는 '별로에요'를 누른 모든 영화 ID 목록 가져오기 (나중에 필터링할 때 사용!)
    List<UserInteraction> findAllByUserIdAndInteractionTypeIn(Long userId, List<InteractionType> types);
}