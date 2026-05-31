package com.dailycut.backend.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MyInteractionsResponseDto {
    private List<InteractionItemDto> like;
    private List<InteractionItemDto> watched;
    private List<InteractionItemDto> dislike;
}
