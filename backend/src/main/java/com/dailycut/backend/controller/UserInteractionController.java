package com.dailycut.backend.controller;

import com.dailycut.backend.dto.ApiResponseDto;
import com.dailycut.backend.dto.EvaluationRequest;
import com.dailycut.backend.service.AuthenticatedUserResolver;
import com.dailycut.backend.service.UserInteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/contents")
@RequiredArgsConstructor
public class UserInteractionController {

    private final AuthenticatedUserResolver authenticatedUserResolver;
    private final UserInteractionService interactionService;

    @PostMapping("/{contentId}/evaluate")
    public ResponseEntity<ApiResponseDto<String>> evaluateContent(
            @PathVariable String contentId,
            @RequestBody EvaluationRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        try {
            Long userId = authenticatedUserResolver.requireUserId(authorizationHeader);

            interactionService.evaluateContent(userId, contentId, request);

            return ResponseEntity.ok(ApiResponseDto.success("반응이 저장되었습니다."));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(ApiResponseDto.error(e.getStatusCode().value(), e.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponseDto.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "서버 오류가 발생했습니다."));
        }
    }

    @DeleteMapping("/{contentId}/evaluate")
    public ResponseEntity<ApiResponseDto<String>> cancelEvaluation(
            @PathVariable String contentId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {

        try {
            Long userId = authenticatedUserResolver.requireUserId(authorizationHeader);

            interactionService.deleteInteraction(userId, contentId);

            return ResponseEntity.ok(ApiResponseDto.success("반응이 취소되었습니다."));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(ApiResponseDto.error(e.getStatusCode().value(), e.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponseDto.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "서버 오류가 발생했습니다."));
        }
    }
}
