package com.dailycut.backend.controller;

import com.dailycut.backend.dto.ApiResponseDto;
import com.dailycut.backend.dto.GenrePreferenceRequestDto;
import com.dailycut.backend.dto.GenrePreferenceResponseDto;
import com.dailycut.backend.dto.MyInteractionsResponseDto;
import com.dailycut.backend.dto.OttSettingsRequestDto;
import com.dailycut.backend.dto.OttSettingsResponseDto;
import com.dailycut.backend.dto.UpdateInteractionRequestDto;
import com.dailycut.backend.service.AuthenticatedUserResolver;
import com.dailycut.backend.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final AuthenticatedUserResolver authenticatedUserResolver;
    private final MyPageService myPageService;

    @GetMapping("/interactions")
    public ApiResponseDto<MyInteractionsResponseDto> getInteractions(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserResolver.requireUserId(authorizationHeader);
        return ApiResponseDto.success(myPageService.getInteractions(userId));
    }

    @PutMapping("/interactions/{contentId}")
    public ApiResponseDto<String> updateInteraction(
            @PathVariable String contentId,
            @RequestBody UpdateInteractionRequestDto request,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserResolver.requireUserId(authorizationHeader);
        myPageService.updateInteraction(userId, contentId, request == null ? null : request.getEvaluationType());
        return ApiResponseDto.success("반응이 변경되었습니다.");
    }

    @DeleteMapping("/interactions/{contentId}")
    public ApiResponseDto<String> deleteInteraction(
            @PathVariable String contentId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserResolver.requireUserId(authorizationHeader);
        myPageService.deleteInteraction(userId, contentId);
        return ApiResponseDto.success("반응 기록이 삭제되었습니다.");
    }

    @GetMapping("/otts")
    public ApiResponseDto<OttSettingsResponseDto> getOtts(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserResolver.requireUserId(authorizationHeader);
        return ApiResponseDto.success(myPageService.getOtts(userId));
    }

    @PutMapping("/otts")
    public ApiResponseDto<OttSettingsResponseDto> updateOtts(
            @RequestBody OttSettingsRequestDto request,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserResolver.requireUserId(authorizationHeader);
        return ApiResponseDto.success(myPageService.updateOtts(userId, request == null ? null : request.getOtts()));
    }

    @GetMapping("/preferences")
    public ApiResponseDto<GenrePreferenceResponseDto> getPreferences(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserResolver.requireUserId(authorizationHeader);
        return ApiResponseDto.success(myPageService.getPreferences(userId));
    }

    @PutMapping("/preferences")
    public ApiResponseDto<GenrePreferenceResponseDto> updatePreferences(
            @RequestBody GenrePreferenceRequestDto request,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        Long userId = authenticatedUserResolver.requireUserId(authorizationHeader);
        return ApiResponseDto.success(myPageService.updatePreferences(userId, request == null ? null : request.getGenres()));
    }
}
