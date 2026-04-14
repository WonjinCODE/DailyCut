package com.dailycut.backend.controller;
 
import com.dailycut.backend.dto.ApiResponseDto;
import com.dailycut.backend.dto.ContentResponseDto;
import com.dailycut.backend.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
 
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
 
@RestController
@RequestMapping("/api/v1/contents")
@RequiredArgsConstructor
public class RecommendController {
 
    private final RecommendService recommendService;
 
    /**
     * 콘텐츠 추천 API
     *
     * @param time  가용 시간 (분, 필수)
     * @param otts  OTT 플랫폼 (콤마 구분, 필수) 예: "netflix,tving"
     * @param genre 장르 ID (콤마 구분, 선택) 예: "35,28"
     */
    @GetMapping("/recommend")
    public ApiResponseDto<List<ContentResponseDto>> recommend(
            @RequestParam Integer time,
            @RequestParam String otts,
            @RequestParam(required = false) String genre) {
 
        // "35,28" → Set<Integer>{35, 28} 변환
        Set<Integer> genreIds = parseGenreIds(genre);
 
        List<ContentResponseDto> recommendations =
                recommendService.getRecommendations(time, otts, genreIds);
 
        return ApiResponseDto.success(recommendations);
    }
 
    private Set<Integer> parseGenreIds(String genre) {
        if (genre == null || genre.isBlank()) return Collections.emptySet();
        try {
            return Arrays.stream(genre.split(","))
                    .map(String::trim)
                    .map(Integer::parseInt)
                    .collect(Collectors.toSet());
        } catch (Exception e) {
            return Collections.emptySet();
        }
    }
}