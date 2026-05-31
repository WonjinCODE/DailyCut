package com.dailycut.backend.dto;

import com.dailycut.backend.domain.enums.InteractionType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class InteractionItemDto {
    private String contentId;
    private String title;
    private String contentType;
    private String posterUrl;
    private Integer runtime;
    private List<Integer> genreIds;
    private InteractionType interactionType;
    private LocalDateTime createdAt;
}
