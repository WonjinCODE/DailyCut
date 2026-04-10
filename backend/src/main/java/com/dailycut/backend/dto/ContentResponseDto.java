package com.dailycut.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.AllArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentResponseDto {
    private Long id;
    private String type;
    private String title;
    private String posterUrl;
    private String overview;
    private List<Integer> genreIds;

    @JsonProperty("isRuntimeFallback")
    private Boolean isRuntimeFallback;

    private Integer runtime;
    private Double tmdbRating;
    private Double popularity;

    private Double scoreT;
    private Double scoreG;
    private Double scoreQ;
    private Double scoreP;
    private Double scoreD;
    private Double scoreE;
    private Double scoreU;
    private Double finalScore;
}