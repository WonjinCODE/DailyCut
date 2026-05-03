package com.dailycut.backend.dto;

import com.dailycut.backend.domain.enums.InteractionType;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class EvaluationRequest {
    private InteractionType evaluationType;
    private String title;
    private String type;
    private List<Integer> genreIds;
    private String posterUrl;
    private Integer runtime;
}
