package com.dailycut.backend.service;

import com.dailycut.backend.entity.User;
import com.dailycut.backend.repository.UserRepository;
import com.dailycut.backend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AuthenticatedUserResolver {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public Optional<Long> resolveUserId(String authorizationHeader) {
        String token = extractBearerToken(authorizationHeader);
        if (token == null || !jwtUtil.validateToken(token)) {
            return Optional.empty();
        }

        return findUserByToken(token).map(User::getUserId);
    }

    public Long requireUserId(String authorizationHeader) {
        String token = extractBearerToken(authorizationHeader);
        if (token == null || !jwtUtil.validateToken(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "유효한 로그인 토큰이 필요합니다.");
        }

        return findUserByToken(token)
                .map(User::getUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인한 사용자를 찾을 수 없습니다."));
    }

    private Optional<User> findUserByToken(String token) {
        String email = jwtUtil.getEmailFromToken(token);
        return userRepository.findByEmail(email);
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            return null;
        }

        if (!authorizationHeader.startsWith("Bearer ")) {
            return null;
        }

        String token = authorizationHeader.substring(7).trim();
        return token.isEmpty() ? null : token;
    }
}
