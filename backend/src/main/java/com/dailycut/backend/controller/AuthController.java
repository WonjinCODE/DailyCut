package com.dailycut.backend.controller;

import com.dailycut.backend.dto.ApiResponseDto;
import com.dailycut.backend.dto.AuthResponseDto;
import com.dailycut.backend.dto.LoginRequestDto;
import com.dailycut.backend.dto.SignupRequestDto;
import com.dailycut.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ApiResponseDto<AuthResponseDto> signup(
            @Valid @RequestBody SignupRequestDto request) {
        AuthResponseDto response = authService.signup(request);
        return ApiResponseDto.success(response);
    }

    @PostMapping("/login")
    public ApiResponseDto<AuthResponseDto> login(
            @Valid @RequestBody LoginRequestDto request) {
        AuthResponseDto response = authService.login(request);
        return ApiResponseDto.success(response);
    }
}