package com.dailycut.backend.service;

import com.dailycut.backend.entity.UserInteraction;
import com.dailycut.backend.domain.enums.InteractionType;
import com.dailycut.backend.repository.UserInteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserInteractionService {

    private final UserInteractionRepository interactionRepository;

    @Transactional
    public void evaluateContent(Long userId, String contentId, InteractionType type) {
        // 이미 이 유저가 이 영화에 평가를 남긴 적이 있는지 DB에서 확인
        Optional<UserInteraction> existing = interactionRepository.findByUserIdAndContentId(userId, contentId);

        if (existing.isPresent()) {
            // 이미 평가한 적이 있다면, 누른 버튼의 종류만 업데이트 (예: 볼거에요 -> 봤어요)
            existing.get().setInteractionType(type);
        } else {
            // 처음 평가하는 거라면 새로 만들어서 DB에 저장
            UserInteraction newInteraction = new UserInteraction();
            newInteraction.setUserId(userId);
            newInteraction.setContentId(contentId);
            newInteraction.setInteractionType(type);
            interactionRepository.save(newInteraction);
        }
    }
}