package com.dailycut.backend.dto;

import com.dailycut.backend.domain.enums.InteractionType;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EvaluationRequest {
    private InteractionType evaluationType;
}