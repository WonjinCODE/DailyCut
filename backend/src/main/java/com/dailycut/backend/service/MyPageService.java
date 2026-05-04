package com.dailycut.backend.service;

import com.dailycut.backend.domain.enums.InteractionType;
import com.dailycut.backend.dto.GenrePreferenceResponseDto;
import com.dailycut.backend.dto.InteractionItemDto;
import com.dailycut.backend.dto.MyInteractionsResponseDto;
import com.dailycut.backend.dto.OttSettingsResponseDto;
import com.dailycut.backend.entity.User;
import com.dailycut.backend.entity.UserInteraction;
import com.dailycut.backend.entity.UserOtt;
import com.dailycut.backend.entity.UserPreference;
import com.dailycut.backend.repository.UserInteractionRepository;
import com.dailycut.backend.repository.UserOttRepository;
import com.dailycut.backend.repository.UserPreferenceRepository;
import com.dailycut.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MyPageService {

    private static final Set<String> SUPPORTED_OTTS = Set.of(
            "NETFLIX",
            "TVING",
            "WAVVE",
            "DISNEY_PLUS",
            "WATCHA",
            "COUPANG_PLAY"
    );

    private static final Set<String> SUPPORTED_GENRES = Set.of(
            "ACTION",
            "COMEDY",
            "ROMANCE",
            "THRILLER",
            "SF",
            "FANTASY",
            "CRIME",
            "DOCUMENTARY",
            "ANIMATION",
            "DRAMA"
    );

    private final UserRepository userRepository;
    private final UserInteractionRepository userInteractionRepository;
    private final UserOttRepository userOttRepository;
    private final UserPreferenceRepository userPreferenceRepository;

    @Transactional(readOnly = true)
    public MyInteractionsResponseDto getInteractions(Long userId) {
        List<InteractionItemDto> like = new ArrayList<>();
        List<InteractionItemDto> watched = new ArrayList<>();
        List<InteractionItemDto> dislike = new ArrayList<>();

        userInteractionRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .forEach(interaction -> {
                    InteractionItemDto item = toInteractionItem(interaction);
                    if (interaction.getInteractionType() == InteractionType.LIKE) {
                        like.add(item);
                    } else if (interaction.getInteractionType() == InteractionType.WATCHED) {
                        watched.add(item);
                    } else if (interaction.getInteractionType() == InteractionType.DISLIKE) {
                        dislike.add(item);
                    }
                });

        return MyInteractionsResponseDto.builder()
                .like(like)
                .watched(watched)
                .dislike(dislike)
                .build();
    }

    @Transactional
    public void updateInteraction(Long userId, String contentId, InteractionType evaluationType) {
        if (evaluationType == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "evaluationType은 필수입니다.");
        }

        UserInteraction interaction = userInteractionRepository.findByUserIdAndContentId(userId, contentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 반응 기록을 찾을 수 없습니다."));

        interaction.setInteractionType(evaluationType);
    }

    @Transactional
    public void deleteInteraction(Long userId, String contentId) {
        UserInteraction interaction = userInteractionRepository.findByUserIdAndContentId(userId, contentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 반응 기록을 찾을 수 없습니다."));

        userInteractionRepository.delete(interaction);
    }

    @Transactional(readOnly = true)
    public OttSettingsResponseDto getOtts(Long userId) {
        List<String> otts = userOttRepository.findByUser_UserId(userId).stream()
                .map(UserOtt::getOttCode)
                .toList();

        return new OttSettingsResponseDto(otts);
    }

    @Transactional
    public OttSettingsResponseDto updateOtts(Long userId, List<String> requestedOtts) {
        User user = getUser(userId);
        List<String> otts = normalizeAndValidate(requestedOtts, SUPPORTED_OTTS, "지원하지 않는 OTT입니다: ");

        userOttRepository.deleteByUser_UserId(userId);
        otts.stream()
                .map(ottCode -> UserOtt.builder()
                        .user(user)
                        .ottCode(ottCode)
                        .build())
                .forEach(userOttRepository::save);

        return new OttSettingsResponseDto(otts);
    }

    @Transactional(readOnly = true)
    public GenrePreferenceResponseDto getPreferences(Long userId) {
        List<String> genres = userPreferenceRepository.findByUser_UserIdOrderByPriorityAsc(userId).stream()
                .map(UserPreference::getGenreCode)
                .toList();

        return new GenrePreferenceResponseDto(genres);
    }

    @Transactional
    public GenrePreferenceResponseDto updatePreferences(Long userId, List<String> requestedGenres) {
        User user = getUser(userId);
        List<String> genres = normalizeAndValidate(requestedGenres, SUPPORTED_GENRES, "지원하지 않는 장르입니다: ");

        userPreferenceRepository.deleteByUser_UserId(userId);
        for (int i = 0; i < genres.size(); i += 1) {
            userPreferenceRepository.save(UserPreference.builder()
                    .user(user)
                    .genreCode(genres.get(i))
                    .priority(i + 1)
                    .build());
        }

        return new GenrePreferenceResponseDto(genres);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인한 사용자를 찾을 수 없습니다."));
    }

    private InteractionItemDto toInteractionItem(UserInteraction interaction) {
        return InteractionItemDto.builder()
                .contentId(interaction.getContentId())
                .title(interaction.getContentTitle())
                .contentType(interaction.getContentType())
                .posterUrl(interaction.getPosterUrl())
                .runtime(interaction.getRuntime())
                .genreIds(parseGenreIds(interaction))
                .interactionType(interaction.getInteractionType())
                .createdAt(interaction.getCreatedAt())
                .build();
    }

    private List<Integer> parseGenreIds(UserInteraction interaction) {
        try {
            return interaction.getParsedGenreIds();
        } catch (NumberFormatException e) {
            return List.of();
        }
    }

    private List<String> normalizeAndValidate(List<String> values, Set<String> supportedCodes, String errorPrefix) {
        if (values == null) {
            return List.of();
        }

        LinkedHashSet<String> normalizedValues = new LinkedHashSet<>();
        for (String value : values) {
            if (value == null || value.isBlank()) {
                continue;
            }

            String normalizedValue = value.trim().toUpperCase(Locale.ROOT);
            if (!supportedCodes.contains(normalizedValue)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errorPrefix + normalizedValue);
            }

            normalizedValues.add(normalizedValue);
        }

        return new ArrayList<>(normalizedValues);
    }
}
