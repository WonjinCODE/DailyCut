package com.dailycut.backend.controller;

import com.dailycut.backend.dto.ApiResponseDto;
import com.dailycut.backend.dto.MyPageResponseDto;
import com.dailycut.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET /api/v1/users/me
    @GetMapping("/me")
    public ApiResponseDto<MyPageResponseDto> getMyInfo(Authentication authentication) {
        // 현재 로그인한 사람의 이메일(토큰에서 추출된 정보)을 가져옵니다.
        String email = authentication.getName(); 
        
        MyPageResponseDto response = userService.getMyPageData(email);
        return ApiResponseDto.success(response);
    }
}