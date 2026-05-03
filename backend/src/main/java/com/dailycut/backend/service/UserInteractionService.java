package com.dailycut.backend.service;

import com.dailycut.backend.dto.EvaluationRequest;
import com.dailycut.backend.entity.UserInteraction;
import com.dailycut.backend.repository.UserInteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserInteractionService {

    private final UserInteractionRepository interactionRepository;

    @Transactional
    public void evaluateContent(Long userId, String contentId, EvaluationRequest request) {
        if (request.getEvaluationType() == null) {
            throw new IllegalArgumentException("evaluationType은 필수입니다.");
        }

        // 이미 이 유저가 이 영화에 평가를 남긴 적이 있는지 DB에서 확인
        Optional<UserInteraction> existing = interactionRepository.findByUserIdAndContentId(userId, contentId);

        if (existing.isPresent()) {
            // 이미 평가한 적이 있다면, 누른 버튼의 종류만 업데이트 (예: 볼거에요 -> 봤어요)
            UserInteraction interaction = existing.get();
            interaction.setInteractionType(request.getEvaluationType());
            applyMetadata(interaction, request);
        } else {
            // 처음 평가하는 거라면 새로 만들어서 DB에 저장
            UserInteraction newInteraction = new UserInteraction();
            newInteraction.setUserId(userId);
            newInteraction.setContentId(contentId);
            newInteraction.setInteractionType(request.getEvaluationType());
            applyMetadata(newInteraction, request);
            interactionRepository.save(newInteraction);
        }
    }

    private void applyMetadata(UserInteraction interaction, EvaluationRequest request) {
        if (request.getTitle() != null) {
            interaction.setContentTitle(request.getTitle());
        }
        if (request.getType() != null) {
            interaction.setContentType(request.getType());
        }
        if (request.getPosterUrl() != null) {
            interaction.setPosterUrl(request.getPosterUrl());
        }
        if (request.getRuntime() != null) {
            interaction.setRuntime(request.getRuntime());
        }

        String genreIdsCsv = toGenreIdsCsv(request.getGenreIds());
        if (genreIdsCsv != null) {
            interaction.setGenreIds(genreIdsCsv);
        }
    }

    private String toGenreIdsCsv(List<Integer> genreIds) {
        if (genreIds == null || genreIds.isEmpty()) {
            return null;
        }

        return genreIds.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));
    }
}
