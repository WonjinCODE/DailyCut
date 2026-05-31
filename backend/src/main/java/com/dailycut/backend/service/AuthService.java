package com.dailycut.backend.service;

import com.dailycut.backend.dto.AuthResponseDto;
import com.dailycut.backend.dto.LoginRequestDto;
import com.dailycut.backend.dto.SignupRequestDto;
import com.dailycut.backend.entity.RefreshToken;
import com.dailycut.backend.entity.User;
import com.dailycut.backend.repository.RefreshTokenRepository;
import com.dailycut.backend.repository.UserRepository;
import com.dailycut.backend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponseDto signup(SignupRequestDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .build();
        userRepository.save(user);

        return issueTokens(user);
    }

    @Transactional
    public AuthResponseDto login(LoginRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        refreshTokenRepository.deleteByUser_UserId(user.getUserId());

        return issueTokens(user);
    }

    private AuthResponseDto issueTokens(User user) {
        String accessToken  = jwtUtil.generateAccessToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        RefreshToken tokenEntity = RefreshToken.builder()
                .user(user)
                .tokenValue(refreshToken)
                .expiresAt(LocalDateTime.now().plusSeconds(
                        jwtUtil.getRefreshExpiration() / 1000))
                .build();
        refreshTokenRepository.save(tokenEntity);

        return new AuthResponseDto(
                accessToken,
                refreshToken,
                user.getEmail(),
                user.getNickname()
        );
    }
}