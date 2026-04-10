package com.dailycut.backend.dto;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

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
    private Double popularity;
    private List<Integer> genreIds;
    private boolean isRuntimeFallback;

    // 빌더가 작동하지 않을 경우를 대비한 수동 생성 메서드
    public static ContentResponseDto of(Long id, String type, String title, String posterUrl, String overview, Double popularity, List<Integer> genreIds, boolean isRuntimeFallback) {
        return new ContentResponseDto(id, type, title, posterUrl, overview, popularity, genreIds, isRuntimeFallback);
    }
}
