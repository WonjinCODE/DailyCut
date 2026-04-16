package com.dailycut.backend.controller;

import com.dailycut.backend.dto.EvaluationRequest;
import com.dailycut.backend.service.UserInteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contents")
@RequiredArgsConstructor
public class UserInteractionController {

    private final UserInteractionService interactionService;

    @PostMapping("/{contentId}/evaluate")
    public ResponseEntity<?> evaluateContent(
            @PathVariable String contentId,
            @RequestBody EvaluationRequest request,
            @RequestHeader("Authorization") String token) {

        try {
            // ⭐ 핵심 포인트: 원래는 토큰(token)을 해독해서 진짜 로그인한 유저의 ID를 꺼내야 합니다!
            // 하지만 테스트를 위해 일단 '1번 유저(1L)'가 눌렀다고 가짜 ID를 고정해두겠습니다.
            Long userId = 1L; 

            interactionService.evaluateContent(userId, contentId, request.getEvaluationType());
            
            // 성공하면 프론트엔드에 성공 메시지 전송
            return ResponseEntity.ok().body("{\"message\": \"평가 성공!\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"message\": \"서버 오류가 발생했습니다.\"}");
        }
    }
}