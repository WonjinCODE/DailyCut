package com.dailycut.backend.controller;

import com.dailycut.backend.dto.ApiResponseDto;
import com.dailycut.backend.dto.ContentResponseDto;
import com.dailycut.backend.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contents")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    @GetMapping("/recommend")
    public ApiResponseDto<List<ContentResponseDto>> recommend(
            @RequestParam Integer time,
            @RequestParam String otts,
            @RequestParam(required = false) String mode) {
        
        List<ContentResponseDto> recommendations = recommendService.getRecommendations(time, otts, mode);
        return ApiResponseDto.success(recommendations);
    }
}
